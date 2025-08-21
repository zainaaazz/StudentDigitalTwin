// controllers/digitalTwinController.js
const DigitalTwin = require('../models/DigitalTwin');

// Get all digital twin records
const getAllRecords = async (req, res) => {
  try {
    const records = await DigitalTwin.find();
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single record by ID
const getRecordById = async (req, res) => {
  try {
    const record = await DigitalTwin.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get records by student ID
const getRecordsByStudentId = async (req, res) => {
  try {
    const records = await DigitalTwin.find({ id_student: req.params.studentId });
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get records with pagination
const getRecordsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await DigitalTwin.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await DigitalTwin.countDocuments();

    res.status(200).json({
      success: true,
      count: records.length,
      total: total,
      page: page,
      pages: Math.ceil(total / limit),
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Filter records by final_result
const getRecordsByResult = async (req, res) => {
  try {
    const { result } = req.params;
    const records = await DigitalTwin.find({ final_result: result });
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get statistics/summary
const getStatistics = async (req, res) => {
  try {
    const totalRecords = await DigitalTwin.countDocuments();
    const passCount = await DigitalTwin.countDocuments({ final_result: 'Pass' });
    const failCount = await DigitalTwin.countDocuments({ final_result: { $ne: 'Pass' } });

    // Get average studied credits
    const avgCredits = await DigitalTwin.aggregate([
      { $group: { _id: null, avgCredits: { $avg: '$studied_credits' } } }
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalRecords,
        passCount,
        failCount,
        passRate: ((passCount / totalRecords) * 100).toFixed(2) + '%',
        averageStudiedCredits: avgCredits.length > 0 ? avgCredits[0].avgCredits.toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new record (if needed)
const createRecord = async (req, res) => {
  try {
    const record = await DigitalTwin.create(req.body);
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update a record
const updateRecord = async (req, res) => {
  try {
    const record = await DigitalTwin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a record
const deleteRecord = async (req, res) => {
  try {
    const record = await DigitalTwin.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  getRecordsByStudentId,
  getRecordsWithPagination,
  getRecordsByResult,
  getStatistics,
  createRecord,
  updateRecord,
  deleteRecord
};