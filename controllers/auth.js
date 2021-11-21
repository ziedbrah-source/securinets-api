const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc Register user
// @route Post /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  // Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});

// @desc Login user
// @route Post /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and passowrd", 400));
  }

  // check for user
  const user = await User.findOne({
    email: email,
  }).select("+password"); // because we made select: false in the model, so we add it here
  // Create token
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // check if password matchs
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});
