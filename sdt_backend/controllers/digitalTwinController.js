// controllers/digitalTwinController.js
const mongoose = require('mongoose');
const DigitalTwin = require('../models/DigitalTwin');

/**
 * Run aggregation on native collection with allowDiskUse:true (Atlas/Mongo driver)
 */
async function runAggregationWithDiskUse(pipeline, collectionName = 'digitaltwin') {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('MongoDB connection not initialized');
  }
  const coll = mongoose.connection.db.collection(collectionName);
  const cursor = coll.aggregate(pipeline, { allowDiskUse: true });
  return cursor.toArray();
}

/**
 * Convert projection object to Mongoose select string
 */
function projectionToSelect(proj) {
  // keep only keys that are set to 1
  return Object.keys(proj).filter(k => proj[k] === 1).join(' ');
}

const controller = {
  // ... keep your other endpoints unchanged (debugDatabase, testConnection, etc.)
  // Only showing the endpoints we changed / added here for brevity

  // Get student data (index-first, fallback to allowDiskUse aggregation)
  getStudentData: async (req, res) => {
    console.log('=== API CALLED ===');
    console.log('Query params:', req.query);
    console.log('==================');
    
    try {
      const { studentId, limit: limitRaw, page: pageRaw } = req.query;
      const limit = Math.min(parseInt(limitRaw, 10) || 100, 1000); // cap to avoid huge responses
      const page = Math.max(parseInt(pageRaw, 10) || 1, 1);

      // Minimal projection to reduce memory
      const projection = {
        _id: 1,
        id_student: 1,
        date: 1,
        homepage: 1,
        oucontent: 1,
        subpage: 1,
        url: 1,
        forumng: 1,
        resource: 1,
        final_result: 1,
        studied_credits: 1
      };

      // If no specific student requested, require pagination (sorting entire collection can explode memory)
      if (!studentId || studentId === 'all') {
        // Use pagination and index if possible; otherwise use aggregation with allowDiskUse
        const skip = (page - 1) * limit;

        // Use find with sort; let MongoDB use index if present.
        const records = await DigitalTwin.find({})
          .select(projectionToSelect(projection))
          .lean()
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .exec();

        const total = await DigitalTwin.countDocuments();

        return res.json({
          success: true,
          data: records,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
      }

      // Specific student: prefer index-backed find + hint
      const sid = parseInt(studentId, 10);
      if (Number.isNaN(sid)) {
        return res.status(400).json({ success: false, error: 'studentId must be a number or "all"' });
      }

      try {
        // First attempt: find() sorted by date — we supply a hint for the compound index
        const records = await DigitalTwin.find({ id_student: sid })
          .select(projectionToSelect(projection))
          .lean()
          .sort({ date: 1 })
          .hint({ id_student: 1, date: 1 }) // force index usage if available
          .exec();

          console.log(`Found ${records.length} records for student ${sid}`);
          console.log('Date range:', records.map(r => r.date));
          console.log('Sample records:', records.slice(0, 5).map(r => ({ date: r.date, homepage: r.homepage, content: r.oucontent })));

        // If this returns without error, we're done
        return res.json({
          success: true,
          data: records,
          count: records.length,
          method: 'find_with_hint'
        });
      } catch (err) {
        // If the driver/server rejected the sort (memory) or the hint wasn't usable, fall back to aggregation
        console.warn('find-with-hint failed, falling back to aggregation with allowDiskUse:', err && err.message);

        // Aggregation pipeline: match -> sort (index can cover this if index exists) -> project
        // Note: we place $sort before $project here so the query planner can use the index for the sort.
        const pipeline = [
          { $match: { id_student: sid } },
          { $sort: { date: 1 } },        // put sort before project so index can satisfy it
          { $project: projection }
        ];

        const recordsAgg = await runAggregationWithDiskUse(pipeline, 'digitaltwin');
        
        console.log(`Aggregation found ${recordsAgg.length} records for student ${sid}`);
        console.log('Aggregation date range:', recordsAgg.map(r => r.date));

        return res.json({
          success: true,
          data: recordsAgg,
          count: recordsAgg.length,
          method: 'aggregation_allowDiskUse'
        });
      }
    } catch (error) {
      console.error('Error in getStudentData:', error);
      const status = (error && error.code === 292) ? 413 : 500;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get records by student id debug route (similar strategy)
  getRecordsByStudentId: async (req, res) => {
    try {
      const studentId = parseInt(req.params.studentId, 10);
      if (Number.isNaN(studentId)) {
        return res.status(400).json({ success: false, error: 'invalid studentId' });
      }

      const projection = {
        _id: 1,
        id_student: 1,
        date: 1,
        homepage: 1,
        oucontent: 1,
        subpage: 1,
        url: 1,
        forumng: 1,
        resource: 1,
        final_result: 1,
        studied_credits: 1
      };

      try {
        // Try index-backed find
        const records = await DigitalTwin.find({ id_student: studentId })
          .select(projectionToSelect(projection))
          .lean()
          .sort({ date: 1 })
          .hint({ id_student: 1, date: 1 })
          .exec();

        if (!records || records.length === 0) {
          const sampleStudents = await DigitalTwin.distinct('id_student');
          return res.status(404).json({
            success: false,
            error: 'No records found for this student',
            debug: {
              requestedStudentId: studentId,
              sampleStudentIds: sampleStudents.slice(0, 10)
            }
          });
        }

        const summary = await DigitalTwin.getStudentSummary(studentId);

        return res.json({
          success: true,
          data: { records, summary: summary[0] || null, recordCount: records.length },
          method: 'find_with_hint'
        });
      } catch (err) {
        console.warn('find-with-hint failed in getRecordsByStudentId; trying aggregation with allowDiskUse', err && err.message);

        const pipeline = [
          { $match: { id_student: studentId } },
          { $sort: { date: 1 } },
          { $project: projection }
        ];

        const recordsAgg = await runAggregationWithDiskUse(pipeline, 'digitaltwin');

        if (!recordsAgg || recordsAgg.length === 0) {
          const sampleStudents = await DigitalTwin.distinct('id_student');
          return res.status(404).json({
            success: false,
            error: 'No records found for this student (agg)',
            debug: { sampleStudentIds: sampleStudents.slice(0, 10) }
          });
        }

        const summary = await DigitalTwin.getStudentSummary(studentId);

        return res.json({
          success: true,
          data: { records: recordsAgg, summary: summary[0] || null, recordCount: recordsAgg.length },
          method: 'aggregation_allowDiskUse'
        });
      }
    } catch (error) {
      console.error('Error in getRecordsByStudentId:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  },

  // other controller methods (getUniqueStudents, analytics, etc.) can remain as in your original file...
};

module.exports = controller;
