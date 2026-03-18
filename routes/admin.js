const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const { getAllUsers } = require('../controllers/adminController');
const router = express.Router();

router.post('/users', auth, adminOnly, getAllUsers);

module.exports = router;