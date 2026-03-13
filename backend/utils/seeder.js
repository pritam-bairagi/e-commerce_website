const User = require('../models/User');

// @desc    Seed Admin User
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'adminpassword123',
                phoneNumber: '1234567890',
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user seeded successfully');
        } else {
            // Update password to ensure it's hashed with the latest model hooks
            adminExists.password = 'adminpassword123';
            adminExists.isVerified = true;
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin user password updated/verified');
        }
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedAdmin;
