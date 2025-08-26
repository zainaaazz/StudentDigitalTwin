// models/DigitalTwin.js
const mongoose = require('mongoose');

const digitalTwinSchema = new mongoose.Schema({
  'Unnamed: 0': Number,
  id_student: Number,
  date: Number,
  homepage: Number,
  oucontent: Number,
  subpage: Number,
  url: Number,
  forumng: Number,
  resource: Number,
  repeatactivity: Number,
  glossary: Number,
  dataplus: Number,
  oucollaborate: Number,
  htmlactivity: Number,
  questionnaire: Number,
  dualpane: Number,
  quiz: Number,
  externalquiz: Number,
  page: Number,
  folder: Number,
  ouwiki: Number,
  sharedsubpage: Number,
  ouelluminate: Number,
  num_of_prev_attempts: Number,
  studied_credits: Number,
  final_result: String,
  code_module_AAA: Number,
  code_module_BBB: Number,
  code_module_CCC: Number,
  code_module_DDD: Number,
  code_module_EEE: Number,
  code_module_FFF: Number,
  code_module_GGG: Number,
  code_presentation_2013B: Number,
  code_presentation_2013J: Number,
  code_presentation_2014B: Number,
  code_presentation_2014J: Number,
  password: { type: String, select: false }
}, {
  collection: 'digitaltwin',
  timestamps: true
});

// Indexes
digitalTwinSchema.index({ id_student: 1 });
digitalTwinSchema.index({ final_result: 1 });
// Important: compound index used to allow index-backed sorts per student
digitalTwinSchema.index({ id_student: 1, date: 1 });

// Statics / helpers kept as before
digitalTwinSchema.statics.getUniqueStudents = async function() {
  const students = await this.distinct('id_student');
  return students.sort((a, b) => a - b);
};

digitalTwinSchema.statics.getStudentSummary = function(studentId) {
  const id = typeof studentId === 'string' ? parseInt(studentId, 10) : studentId;
  return this.aggregate([
    { $match: { id_student: id } },
    {
      $group: {
        _id: '$id_student',
        totalClicks: {
          $sum: {
            $add: [
              { $ifNull: ['$homepage', 0] },
              { $ifNull: ['$oucontent', 0] },
              { $ifNull: ['$subpage', 0] },
              { $ifNull: ['$url', 0] },
              { $ifNull: ['$forumng', 0] },
              { $ifNull: ['$resource', 0] }
            ]
          }
        },
        avgDailyActivity: {
          $avg: {
            $add: [
              { $ifNull: ['$homepage', 0] },
              { $ifNull: ['$oucontent', 0] },
              { $ifNull: ['$subpage', 0] },
              { $ifNull: ['$url', 0] },
              { $ifNull: ['$forumng', 0] },
              { $ifNull: ['$resource', 0] }
            ]
          }
        },
        recordCount: { $sum: 1 },
        finalResult: { $first: '$final_result' },
        studiedCredits: { $first: '$studied_credits' }
      }
    }
  ]);
};

module.exports = mongoose.models.DigitalTwin || mongoose.model('DigitalTwin', digitalTwinSchema, 'digitaltwin');
