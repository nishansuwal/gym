const Order = require("../models/order_schema");
const OrderItem = require("../models/order_item");
const mongoose = require("mongoose");
const { validateAndApplyCoupon } = require("../utils/couponValidator");

// ✅ Utility: Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${timestamp}-${random}`;
};

// ✅ Create Order (with order items)
const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, items, notes, couponCode } = req.body;

    // Validate required fields
    if (!addressId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address ID and at least one item are required",
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    let discountAmount = 0;
    let finalAmount = totalAmount;

    if (couponCode) {
      try {
        const couponData = await validateAndApplyCoupon(
          couponCode,
          totalAmount
        );
        discountAmount = couponData.discountAmount;
        finalAmount = couponData.finalAmount;
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      addressId,
      orderNumber: generateOrderNumber(),
      totalAmount,
      discountAmount,
      finalAmount,
      couponCode: couponCode || null,
      paymentMethod: paymentMethod || "COD",
      notes,
    });

    // Create order items
    const orderItems = items.map((item) => ({
      orderId: order._id,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    await OrderItem.insertMany(orderItems);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ✅ Get all orders (Admin sees all, user sees own)
const getAllOrders = async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? { isDeleted: false }
        : { user: req.user._id, isDeleted: false };

    // Fetch orders (admin => all, user => only their orders)
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("addressId")
      .sort({ created_at: -1 });
    // For each order, fetch related items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate(
          "productId","name sellingPrice sku image"
        );
        return {
          ...order.toObject(),
          orderItems: items,
        };
      })
    );
    // ✅ Send order with its orderItems
    res.status(200).json({
      success: true,
      count: ordersWithItems.length,
      data: ordersWithItems,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ✅ Get single order (with its items)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("addressId");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Restrict access to owner or admin
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    const items = await OrderItem.find({ orderId: id }).populate("productId","name sellingPrice sku image");

    res.status(200).json({
      success: true,
      data: { ...order.toObject(), items },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// ✅ Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update order status",
      });
    }

    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// ✅ Soft Delete (user can delete their order, admin can delete any)
const softDeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Only admin or order owner can delete
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized delete" });
    }

    order.isDeleted = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order moved to trash",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// ✅ Restore deleted order (Admin only)
const restoreOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can restore orders",
      });
    }

    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.isDeleted = false;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order restored successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error restoring order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  softDeleteOrder,
  restoreOrder,
};
