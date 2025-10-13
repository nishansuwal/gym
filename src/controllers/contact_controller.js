const Contact = require("../models/contact_schema");

const createUserContact = async (req, res) => {
  try {
    const { userId, name, phone, email, message } = req.body;

    const contact = new Contact({
      userId,
      name,
      phone,
      email,
      message,
    });
    await contact.save();
    res
      .status(200)
      .json({ message: "your Contact has been saved successfully" });
  } catch (error) {
    console.error("Error creating Contact:", error);
    res.status(400).json({ error: "Failed to create Contact" });
  }
};

const getUserContact = async (req, res) => {
  try {
    const contact = await Contact.find().populate("userId");
    return res.status(200).json(contact);
  } catch (error) {
    console.error(error);
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete({
      _id: req.params?.id,
    });
    if (!contact) {
      return res
        .status(500)
        .json({ message: "Something went wrong while deleteing contact." });
    }
    res.status(200).json({ message: "contact deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createUserContact, getUserContact, deleteContact };
