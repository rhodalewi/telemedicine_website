const multer = require('multer');
const path = require('path');

const createUpload = (folderPath) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/', folderPath))
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + path.extname(file.originalname))
        }
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('image file type not supported'), false)
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 } * 1024 * 1024 //5MB
    })
};

module.exports = createUpload;

/* const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/profilePictures.js');
    },
    filename: (req, file, cb) => {
        const uniqueName = `doctor-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// optional file filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error('Only images allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
})

module.exports = upload; */

