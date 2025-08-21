// routes/digitalTwinRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllRecords,
  getRecordById,
  getRecordsByStudentId,
  getRecordsWithPagination,
  getRecordsByResult,
  getStatistics,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../controllers/digitalTwinController');

// GET /digitaltwin - Get all records
router.get('/', getAllRecords);

// GET /digitaltwin/paginated - Get records with pagination
router.get('/paginated', getRecordsWithPagination);

// GET /digitaltwin/statistics - Get statistics
router.get('/statistics', getStatistics);

// GET /digitaltwin/student/:studentId - Get records by student ID
router.get('/student/:studentId', getRecordsByStudentId);

// GET /digitaltwin/result/:result - Get records by final result
router.get('/result/:result', getRecordsByResult);

// GET /digitaltwin/:id - Get single record by ID
router.get('/:id', getRecordById);

// POST /digitaltwin - Create new record
router.post('/', createRecord);

// PUT /digitaltwin/:id - Update record
router.put('/:id', updateRecord);

// DELETE /digitaltwin/:id - Delete record
router.delete('/:id', deleteRecord);

module.exports = router;