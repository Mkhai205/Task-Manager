import multer from 'multer';

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Create a unique filename
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname); // Set the filename
    },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Allowed MIME types
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false); // Reject the file
    }
};

// Set up multer middleware with storage and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
    },
    fileFilter: fileFilter,
});

const uploadMiddleware = upload.single('image'); // Export the middleware for single file upload with field name 'image'

export default uploadMiddleware; // Export the upload middleware