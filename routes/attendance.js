const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

// Employee routes
router.post('/mark', auth, attendanceController.markAttendance);
router.post('/history', auth, attendanceController.getAttendance);

// Admin routes
router.post('/admin/all', auth, adminOnly, attendanceController.getAllAttendance);

module.exports = router;
