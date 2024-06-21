const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const filter = (file, cb) => {
  const fileType = /pdf|jpeg|png|jpg|jfif/;
  const extname = fileType.test(path.extname(file.originalname));
  if (extname) {
    cb(null, true);
  } else {
    return cb(new Error("Invalid mime type"));
  }
};

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 100000000
  },
  fileFilter: function (req, file, cb) {
    filter(file, cb)
  },
});

module.exports = uploadImage;