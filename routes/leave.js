const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const {
  applyLeave,
  getLeaves,
  updateLeave,
  cancelLeave,
  approveRejectLeave,
  getAllLeaves,
  getLeaveBalance
} = require('../controllers/leaveController');

const router = express.Router();

// Employee routes
router.post('/apply', auth, applyLeave);
router.post('/history', auth, getLeaves);
router.put('/:id', auth, updateLeave);
router.delete('/:id', auth, cancelLeave);
router.post('/balance', auth, getLeaveBalance);

// Admin routes
router.post('/admin/action', auth, adminOnly, approveRejectLeave);
router.post('/admin/all', auth, adminOnly, getAllLeaves);

module.exports = router;
