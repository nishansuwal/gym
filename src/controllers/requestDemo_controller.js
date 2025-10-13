const RequestDemo = require("../models/requestDemo_schema");
const fs = require("fs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const createRequest = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      businessName,
      phoneNumber,
      totalEmployees,
      availableLocation,
      websiteUrl,
      country,
      province,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !businessName ||
      !phoneNumber ||
      !totalEmployees ||
      !availableLocation ||
      !websiteUrl ||
      !country ||
      !province
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userRequest = new RequestDemo({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      businessName: req.body.businessName,
      phone: req.body.phoneNumber,
      employeNum: req.body.totalEmployees,
      location: req.body.availableLocation,
      websiteURL: req.body.websiteUrl,
      country: req.body.country,
      province: req.body.province,
    });
    await userRequest.save();
    // const sendOrderMail = async () => {
    //   const transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //       user: "chandant142@gmail.com",
    //       pass: "qezvtafegssrwrne",
    //     },
    //     logger: true,
    //   });
    //   const emailContent = `
    //     <html>
    //       <head>
    //         <style>
    //           /* Inline CSS */
    //         </style>
    //       </head>
    //       <body>
    //         <div>
    //           <p>Dear [Recipient Name],</p>
    //           <p>We would like to inform you that client has request for demo.</p>
    //           <h2>Cient Details:</h2>
    //           <p>user name: ${firstName} ${lastName}</p>
    //           <p>user email address is  :${email}.</p>
    //           <p>business name: ${businessName}</p>
    //           <p>Please visite website for more details</p>
    //           <p>Thank you for your attention.</p>
    //           <p>Best regards,</p>
    //           <p>Zoomni</p>
    //         </div>
    //       </body>
    //     </html>
    //   `;
    //   const info = await transporter.sendMail({
    //     from: '"chandan thakur" chandant142@gmail.com',
    //     to: admin?.email,
    //     subject: "A request has been sent for demo",
    //     html: emailContent,
    //     headers: { "x-myheader": "test header" },
    //   });
    // };

    res
      .status(200)
      .json({ message: "Your Request has been send successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while requesting for demo !" });
  }
};

const getAllRequest = async (req, res) => {
  try {
    const requestDemo = await RequestDemo.find().sort({ createdAt: -1 });
    res.status(200).json(requestDemo);
  } catch (error) {
    console.log(error);
  }
};

const replyRequest = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const request = await RequestDemo.findById(id);
    if (!request) {
      return res.status(400).json({ message: "Request not found" });
    }
    await RequestDemo.findByIdAndUpdate({ _id: id }, { message: message });

    const sendOrderMail = async () => {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "chandant142@gmail.com",
          pass: "qezvtafegssrwrne",
        },
        logger: true,
      });
      const emailContent = `
        <html>
          <head>
            <style>
              .message::first-letter{
                text-transform: uppercase;
              }
            </style>
          </head>
          <body>
            <div>
              <p>Dear ${request.firstName} ${request.lastName}</p><br/>
              <p>We would like to inform you that U-Preety has accepted your request for demo.</p>
              <h3>Message from admin</h3>
              <p class="message">${message}</p>
              <p>Thank you for your attention.Please visit our Website</p>
              <p>Best regards,</p>
              <p>Zoomni</p>
            </div>
          </body>
        </html>
      `;
      const info = await transporter.sendMail({
        from: '"chandan thakur" chandant142@gmail.com',
        to: request?.email,
        subject: "A request has been sent for demo",
        html: emailContent,
        headers: { "x-myheader": "test header" },
      });
      console.log("Message sent: %s", info.messageId);
    };
    sendOrderMail()
    res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while requesting for demo !" });
  }
};

module.exports = { createRequest, getAllRequest, replyRequest };
