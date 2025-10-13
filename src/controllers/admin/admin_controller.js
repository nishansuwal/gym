const Admin = require("../../models/admin_schema");
const jwt = require("jsonwebtoken");

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Admin.find();
    return res.status(200).json(vendors);
  } catch (error) {
    console.log(error);
  }
};

const getVendors = async (req, res) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    const userToken = req.header("user-token");
    const payload = jwt.verify(userToken, secretKey);
    const { _id } = payload;
    const vendors = await Admin.findById(_id);
    return res.status(200).json(vendors);
  } catch (error) {
    console.log(error);
  }
};

const deletevendor = async (req, res) => {
  const { id } = req.params;
  Admin.findByIdAndDelete(id)
    .then((success) => {
      return res
        .status(200)
        .json({ message: "vendor details deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: err });
    });
};

module.exports = {
  getAllVendors,
  deletevendor,
  getVendors,
};
