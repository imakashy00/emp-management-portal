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

upload.handleUpload = (fieldName) => {
    return (req, res, next) => {
        const uploadSingle = upload.single(fieldName);

        uploadSingle(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Specific Multer errors (like size)
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        message: "File is too large. Maximum size allowed is 5MB."
                    });
                }
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // Custom errors from fileFilter (like invalid type)
                return res.status(400).json({ message: err.message });
            }
            // Everything went fine
            next();
        });
    };
};

// --- NEW HELPER FOR INDEX.JS ---
// This function handles the "index.js thing" (serving the files)
upload.setupStaticServing = (app) => {
    app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));
    console.log("📂 Static file serving initialized for /uploads");
};

module.exports = upload;