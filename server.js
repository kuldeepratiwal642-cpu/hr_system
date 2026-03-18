const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log(process.env.MONGO_URI)
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');

        // Seed admin user (SAFE VERSION)
        const User = require('./models/User');
        const bcrypt = require('bcryptjs');

        const adminEmail = "admin@example.com";
        const adminPassword = "Admin@123";

        if (!adminEmail || !adminPassword) {
            console.log("⚠️ Admin credentials not provided in .env");
            return;
        }

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const admin = new User({
                fullName: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log(' Admin user seeded');
        } else {
            console.log(' Admin already exists');
        }
    })
    .catch(err => console.log(err));

//  Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/admin', require('./routes/admin'));

//  Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
