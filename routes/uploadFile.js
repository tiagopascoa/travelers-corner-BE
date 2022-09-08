const express = require("express");
//Cloudinary
const fileUpload = require("../configs/cloudinary");

const router = express.Router();

//Upload image to cloudinary
router.post("/uploadImage", fileUpload.single("image"), (req, res) => {
    try {
      res.status(200).json({ fileUrl: req.file.path });
    } catch (e) {
      res.status(500).json({ message: `error occurred ${e}` });
    }
  });



module.exports = router;