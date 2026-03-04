require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const seedFirstManager = async () => {
    try {
        conectDB()
        // 2. Check if a manager already exists to prevent duplicates
        const adminExists = await User.findOne({ role: 'manager' });
        if (adminExists) {
            console.log("A manager already exists. Seeding skipped.");
            process.exit();
        }

        // 3. Hash the password with Salt 10
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('#123@Admin', salt); // Change this immediately after login!

        // 4. Create the First Manager
        const firstManager = new User({
            name: 'Super Manager',
            email: 'admin@workbuddy.com',
            password: hashedPassword,
            role: 'manager'
        });

        await firstManager.save();
        console.log("First Manager created successfully!");
        console.log("Email: admin@company.com | Password: #123@Admin");

        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedFirstManager();
