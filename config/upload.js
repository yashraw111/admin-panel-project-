const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "pr_image") {
            cb(null, './uploads/product')
        }
        if(file.fieldname==="admin_profile"){
            cb(null,'./upload/admin_profile')
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "pr_image" || file.fieldname==='admin_profile') {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})
function checkFileType(file, cb) {
    if (file.fieldname === "pr_image" || file.fieldname === "admin_profile") {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/svg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}

module.exports = upload;