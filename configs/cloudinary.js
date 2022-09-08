const cloudinary = require("cloudinary").v2;
//requests for type form-data (allows to send
//files on my requests)
const multer = require("multer");
//connect multer with cloudinary
const { CloudinaryStorage } = require("multer-storage-cloudinary");
//connects the cloudinary library to our subscription
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
//storage configuration on cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "travelers-corner-social-media",
    allowed_formats: ["png", "jpg"],
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadCloud = multer({ storage });
module.exports = uploadCloud;