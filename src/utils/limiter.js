const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,              // Max 5 attempts per minute per IP
  message: {
    success: false,
    message: "Too many login attempts, try again after 1 minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {limiter, loginLimiter};

