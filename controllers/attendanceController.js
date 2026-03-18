const Attendance = require('../models/Attendance');

// Helper: UTC midnight for "today" to avoid timezone drift
const getUtcToday = () => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

// POST /attendance/mark  (body: { status }, date set by server)
exports.markAttendance = async (req, res) => {
    try {
        // console.log(req)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { status } = req.body;
        if (!['Present', 'Absent'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'Present' or 'Absent'." });
        }

        const today = getUtcToday();
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        console.log('Mark attendance:', {
            user: req.user.id,
            status,
            today: today.toISOString()
        });

        // Prevent duplicate for the same UTC date
        const existing = await Attendance.findOne({
            employee: req.user.id,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existing) {
            return res.status(200).json({ message: "Attendance already marked for today", attendance: existing });
        }

        const attendance = await Attendance.create({
            employee: req.user.id,
            date: today,
            status
        });

        return res.status(201).json({ message: `Attendance marked as ${status}`, attendance });
    } catch (error) {
        console.error("🔥 FULL ERROR:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// POST /attendance/history (matches existing client call signature)
exports.getAttendance = async (req, res) => {
    try {
        const data = await Attendance.find({ employee: req.user.id }).sort({ date: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// POST /attendance/admin/all
exports.getAllAttendance = async (req, res) => {
    try {
        const data = await Attendance.find()
            .populate("employee", "fullName email")
            .sort({ date: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
