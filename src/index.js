const express = require("express");
const { PORT } = require("./configs/configuration");
const { json } = require("body-parser");
const expressSession = require("express-session");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const databaseConnection = require("./db_connection/db_connection");
const http = require("http");
const app = express();
const server = http.createServer(app);

databaseConnection();

require("dotenv").config();

app.set("trust proxy", true);
app.use(json());
app.use(cors());
app.use(
  expressSession({
    secret: "somethingsecretgoeshere",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const reviewRouter = require("./routes/review_route");
const productRouter = require("./routes/product_route");
const categorieRouter = require("./routes/categorie_route");
const userAuthRouter = require("./routes/userauth_route");
// const orderRouter = require("./routes/order_route");
const addressRouter = require("./routes/address_route");
// const testimonial = require("./routes/testimonial_route");
// const contactRouter = require("./routes/contact_route");
const couponRouter = require("./routes/coupon_route");
const faqRouter = require("./routes/faq_route");

const userRouter = require("./routes/user_route");

app.use("/api/user", userRouter);
app.use("/api/auth", userAuthRouter);
app.use("/api/products", productRouter);
app.use("/api/review", reviewRouter);
app.use("/api/categorie", categorieRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/faq", faqRouter);
// app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);     // address of farmers
// app.use("/api/testimonial", testimonial);
// app.use("/api/contact", contactRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

server.listen(PORT, console.log(`server running in node on port ${PORT}`));

app.all("*", async (req, res) => {
  return res.status(201).send({ message: "invalid routes" });
});
