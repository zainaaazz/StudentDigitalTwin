// routes/digitalTwinRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/digitalTwinController');

/**
 * Returns a handler function. If the controller function exists and is a function,
 * returns it. Otherwise returns a fallback 501 responder and logs a warning.
 */
function safeHandler(fn, name) {
  if (typeof fn === 'function') return fn;
  return (req, res) => {
    console.warn(`[ROUTES] Missing handler for ${name}; responding 501`);
    res.status(501).json({ error: `${name} not implemented` });
  };
}

// -----------------------------
// DEBUG / HEALTH
// -----------------------------
router.get('/debug', safeHandler(controller.debugDatabase, 'debugDatabase'));
router.get('/test', safeHandler(controller.testConnection, 'testConnection'));

// -----------------------------
// DASHBOARD endpoints (frontend)
// -----------------------------
// list unique students
router.get('/dashboard/students', safeHandler(controller.getUniqueStudents, 'getUniqueStudents'));

// get student records for dashboard (studentId query param, or studentId=all)
router.get('/dashboard/student-data', safeHandler(controller.getStudentData, 'getStudentData'));

// analytics summary (aggregated)
router.get('/dashboard/analytics-summary', safeHandler(controller.getAnalyticsSummary, 'getAnalyticsSummary'));

// daily activity trends
router.get('/dashboard/daily-activity', safeHandler(controller.getDailyActivity, 'getDailyActivity'));

// performance by final_result
router.get('/dashboard/performance', safeHandler(controller.getStudentPerformance, 'getStudentPerformance'));

// activity breakdown (for charts)
router.get('/dashboard/activity-breakdown', safeHandler(controller.getActivityBreakdown, 'getActivityBreakdown'));

// -----------------------------
// STANDARD CRUD and helpers
// Base path for this router should be mounted by app.js e.g. app.use('/api/digitaltwin', router)
// -----------------------------
router.get('/records', safeHandler(controller.getAllRecords, 'getAllRecords'));
router.get('/paginated', safeHandler(controller.getRecordsWithPagination, 'getRecordsWithPagination'));
router.get('/statistics', safeHandler(controller.getStatistics, 'getStatistics'));

// record CRUD
router.get('/records/:id', safeHandler(controller.getRecordById, 'getRecordById'));
router.post('/records', safeHandler(controller.createRecord, 'createRecord'));
router.put('/records/:id', safeHandler(controller.updateRecord, 'updateRecord'));
router.delete('/records/:id', safeHandler(controller.deleteRecord, 'deleteRecord'));

// convenience routes
router.get('/student/:studentId', safeHandler(controller.getRecordsByStudentId, 'getRecordsByStudentId'));
router.get('/result/:result', safeHandler(controller.getRecordsByResult, 'getRecordsByResult'));

module.exports = router;
