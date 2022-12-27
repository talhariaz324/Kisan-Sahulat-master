const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("No Token Available", 401));
  }

  const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedUser.id); // in cookie we store _id as id. and create user in req by req.user and add in it.
  next();
});
//
exports.authorizedRoles = (...roles) => {
  //   console.log(roles);
  return (req, res, next) => {
    // req.user is save above and this user also has a role.
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} has not authorized to view this`,
          403
        )
      );
    }

    next();
  };
};
