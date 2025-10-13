const fs = require("fs");
const path = require("path");

/**
 * Safely deletes a file from the uploads directory.
 * @param {string} folderName - The subfolder in the uploads directory
 * @param {string} fileName - The name of the file to delete
 */
const deleteFile = (folderName, fileName) => {
  if (!fileName) return;

  try {
    // Automatically resolve to the correct uploads folder
    const filePath = path.join(__dirname, "../../uploads", folderName, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`❌ Failed to delete file: ${fileName}`, err);
        } else {
          console.log(`🗑️ Deleted file successfully: ${fileName}`);
        }
      });
    } else {
      console.log(`⚠️ File not found: ${fileName}`);
    }
  } catch (error) {
    console.error(`Error while deleting file: ${fileName}`, error);
  }
};

module.exports = deleteFile;
