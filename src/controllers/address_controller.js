const Address = require("../models/address_schema");

const isSameAddress = (a, b) => {
  const fields = ["name", "phone", "province", "city", "area", "postalcode"];
  return fields.every((key) => a[key] === b[key]);
};

const upsertAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      phone,
      province,
      city,
      area,
      postalcode,
      isDefault = false,
    } = req.body;

    // Find user's current default
    const defaultAddress = await Address.findOne({ userId, isDefault: true });

    // Compare if same as default
    if (defaultAddress && isSameAddress(defaultAddress, req.body)) {
      return res.status(200).json({
        message: "Address is same as default",
        address: defaultAddress,
        addressId: defaultAddress._id,
      });
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId,
      name,
      phone,
      province,
      city,
      area,
      postalcode,
      isDefault,
    });

    return res
      .status(201)
      .json({
        message: "Address saved successfully",
        address: newAddress,
        addressId: newAddress._id,
      });
  } catch (error) {
    console.error("Error saving address:", error);
    return res.status(500).json({ error: "Failed to save address" });
  }
};

const getMyAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Failed to fetch address" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    const existing = await Address.findOne({ _id: addressId, userId });
    if (!existing) {
      return res.status(404).json({ error: "Address not found" });
    }

    Object.assign(existing, req.body);

    // Handle default logic
    if (req.body.isDefault === true) {
      await Address.updateMany({ userId }, { isDefault: false });
      existing.isDefault = true;
    }

    await existing.save();
    res.status(200).json({ message: "Address updated successfully", existing });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
};

/**
 * 🧰 Admin: Get all users' addresses
 */
const getAllAddressesForAdmin = async (req, res) => {
  try {
    const addresses = await Address.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching all addresses:", error);
    res.status(500).json({ error: "Failed to fetch all addresses" });
  }
};

module.exports = {
  upsertAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAllAddressesForAdmin,
};
