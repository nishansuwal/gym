const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/user_auth");
router.post('/verify-khalti', authenticateUser, async (req, res) => {
    try {
        let data = {
            "token": req.body.payload.token,
            "amount": req.body.payload.amount
        };
        let config = {
            headers: { 'Authorization': 'Key test_secret_key_beb145e015544a4196550637a5453df3' }
        };
        const response = await axios.post('https://khalti.com/api/v2/payment/verify/', data, config)
        if (response) {
            // const savedPayment = new Payment({
            //     transId: response.data.idx,
            //     user: req.user?._id,
            //     amount: 2000,
            //     paymentVia: 'khalti',
            //     status: response.data.state?.name

            // });
            // await savedPayment.save();
            return res.status(200).json({ message: 'Payment has been completed' })
        } else {
            return res.status(200).json({ message: 'An error occured while processing the payment.' })
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;