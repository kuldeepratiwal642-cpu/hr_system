const Leave = require('../models/Leave');
const User = require('../models/User');

exports.applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    try {
        const leave = new Leave({ employee: req.user.id, leaveType, startDate, endDate, totalDays, reason });
        await leave.save();
        res.json(leave);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user.id }).sort({ appliedDate: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateLeave = async (req, res) => {
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;

    try {
        // Recalculate total days
        const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

        const updates = { leaveType, startDate, endDate, totalDays, reason };

        const leave = await Leave.findOneAndUpdate(
            { _id: id, employee: req.user.id, status: 'Pending' },
            updates,
            { new: true }
        );

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found or not pending' });
        }

        res.json(leave);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelLeave = async (req, res) => {
    const { id } = req.params;
    try {
        const leave = await Leave.findOneAndDelete({ _id: id, employee: req.user.id, status: 'Pending' });
        if (!leave) return res.status(404).json({ message: 'Leave not found or not pending' });
        res.json({ message: 'Leave cancelled' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveRejectLeave = async (req, res) => {
    const { leaveId, action } = req.body;
    const status = action === 'approve' ? 'Approved' : 'Rejected';
    try {
        const leave = await Leave.findById(leaveId).populate('employee');
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        leave.status = status;
        await leave.save();

        if (status === 'Approved') {
            const user = await User.findById(leave.employee._id);
            user.leaveBalance -= leave.totalDays;
            await user.save();
        }

        res.json(leave);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('employee', 'fullName email').sort({ appliedDate: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLeaveBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ balance: user.leaveBalance });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};