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
  password: String
}, {
  collection: 'digitaltwin', // Explicitly specify collection name
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add indexes for better query performance
digitalTwinSchema.index({ id_student: 1 });
digitalTwinSchema.index({ final_result: 1 });

const DigitalTwin = mongoose.model('DigitalTwin', digitalTwinSchema);

module.exports = DigitalTwin;