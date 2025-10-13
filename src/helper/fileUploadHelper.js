const multer = require("multer");
const fs = require("fs");
const path = require("path");

class FileUploadHelper {
  constructor(destination) {
    // Ensure the destination folder exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        console.log("File Extension:", extension); // Log the extension
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Keeps original extension
      },
    });

    this.fileFilter = (req, file, cb) => {
      const allowedMimeTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."
          ),
          false
        );
      }
    };

    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
    });
  }
}

module.exports = FileUploadHelper;
