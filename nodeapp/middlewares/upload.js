const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express'); // Added express import

const uploadDir = 'uploads';

// Auto-create uploads folder
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("✅ Created 'uploads' directory.");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir + '/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and PDFs are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// --- NEW HELPER FOR INDEX.JS ---
// This function handles the "index.js thing" (serving the files)
upload.setupStaticServing = (app) => {
    app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));
    console.log("📂 Static file serving initialized for /uploads");
};

module.exports = upload;