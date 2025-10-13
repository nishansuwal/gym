const Order = require("../models/order_schema");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const Admin = require("../../models/admin_schema");

const getUserOrder = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find(
      { userId: userId, trashbin: false },
      { trashbin: 0 }
    )
      .populate({
        path: "items.productId",
        model: "product",
      })
      .populate({
        path: "items.adminId",
        model: "admin",
      })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

const getUserOrderClient = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find(
      { userId: userId, trashbin: false },
      { trashbin: 0 }
    )
      .populate({
        path: "items.productId",
        model: "product",
      })
      .populate({
        path: "items.adminId",
        model: "admin",
      })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

const getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.productId",
        model: "product",
      })
      .populate({
        path: "items.adminId",
        model: "admin",
      })
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

const getOrdersDetails = async (req, res) => {
  const adminId = req.admin._id; 
  const { orderId } = req.params;
  try {
    const orders = await Order.findOne({
      _id: orderId,
      "items.adminId": adminId,
    })
      .populate({
        path: "items.productId",
        model: "product",
        populate: {
          path: "categorieId",
          model: "categorie",
        },
      })
      .sort({ createdAt: -1 });
      const filteredItems = orders.items.filter((item) =>
        item.adminId.equals(adminId)
      );
    res.status(200).json({ filteredItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const generateUniqueCode = (length) =>
      crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
    const generateInvoiceId = () => generateUniqueCode(8);

    const cartData = req.body.cartItems;
    const userId = req.body.userId;
    const invoiceId = generateInvoiceId();
    const orderStatus = "pending";
    const fulladdress = req.body.fulladdress;
    const phone = req.body.phone;

    // Calculate total and create items array
    let total = 0;
    const items = cartData.map((data) => {
      total += data.quantity * data.price;
      return {
        productId: data.productId,
        quantity: data.quantity,
        adminId: data.adminId,
      };
    });

    // Create new Order instance
    const newOrder = new Order({
      userId,
      items,
      fulladdress,
      phone,
      orderStatus,
      invoiceId,
      orderTotal: total.toString(),
    });
    await newOrder.save();
    res
      .status(200)
      .json({ message: "Your order has been placed successfully" });
  } catch (error) {
    console.error("Error placing the order:", error);
    res.status(500).json({ error: "Failed to place the order" });
  }
};

const orderEdit = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      throw new Error("No such order found");
    } else {
      const status = order.orderStatus;

      if (status === "pending") {
        order.orderStatus = "completed";
      } else if (status === "completed") {
        order.orderStatus = "cancelled";
      } else if (status === "cancelled") {
        order.orderStatus = "pending";
      }

      await order.save();
      return res.status(201).send({ message: "Status Updated successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Could not update", error: error.message });
  }
};

const orderdelete = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw new Error("No such order found");
    } else {
      return res.status(200).send({ message: "Deleted Successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Could not delete", error: error.message });
  }
};

const clientUpdateStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderItemId, status } = req.body;
  try {
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      throw new Error("No such order found");
    } else {
      const itemIndex = order.items.findIndex(
        (item) => item._id.toString() === orderItemId
      );
      if (itemIndex === -1) {
        return res.status(500).send({ error: "No such Item found" });
      }
      order.items[itemIndex].orderItemStatus = status;
      await order.save();
      return res.status(200).send({
        message: "Status updated successfully",
        updatedOrder: order,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Could not update", error: error.message });
  }
};

const getUserOrderByadminId = async (req, res) => {
  const { adminId } = req.params;
  try {
    const orders = await Order.find(
      { "items.adminId": adminId, trashbin: false },
      { trashbin: 0 }
    )
      .populate({
        path: "items.productId",
        model: "product",
      })
      .populate({
        path: "items.adminId",
        model: "admin",
      })
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

module.exports = {
  getOrder,
  placeOrder,
  getUserOrder,
  getOrdersDetails,
  orderdelete,
  orderEdit,
  getUserOrderClient,
  clientUpdateStatus,
  getUserOrderByadminId,
};
