const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendTokenCookie");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars", // Before Testing must make folder with this name in the cloudinary
    width: 150,
    crop: "scale",
  });

  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const token = user.getJWTToken();
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400)); // bad request code
  }
  const user = await User.findOne({ email }).select("+password"); // As we did select false in model. That's why accessing like that.
  if (!user) {
    return next(new ErrorHandler("No user found", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    // Must mention here is res.
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // process.env.FRONTEND_URL
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it. `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Kisan Sahulat reset",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password Link
exports.resetPasswordLink = catchAsyncError(async (req, res, next) => {
  const resetPasswordTokenHashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetPasswordTokenHashed,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  (user.password = req.body.password),
    (user.resetPasswordToken = undefined),
    (user.resetPasswordExpire = undefined),
    await user.save();
  // For again login by sending token
  sendToken(user, 200, res);
});
// User (ME) Detail
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id); // During Auth we make req.user with all his details (Check auth.js)
  res.status(200).json({
    success: true,
    user,
  });
});

// Update/Change Password (This is not forgot password but updating by using old password)

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password"); // During Auth we make req.user with all his details (Check auth.js) and here also getting select password which was false

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(
        "Please Enter Old Password... This is not your old password",
        400
      )
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res); // Logging in with the new cookie
});

// Update User Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newUserDetails = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
    // avatar: req.body.avatar,
  };

  if (req.body.editAvatar == true && req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserDetails.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    newUserDetails,
    {
      new: true, // new value true
      runValidato$true, // validate
      useFindAndModify: false, // This is false because by default mongodb do find and do some change maybe
    }
  );

  res.status(200).json({
    success: true,
    updatedUser,
  });
});

// Get All Users (From Admin Route)

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User Details (--From Admin Route)

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`No user found with this id ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User ROLE --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  // We will add avatar etc later.
  const newUserDetails = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id, // in case of req.user.id,, it will update admin itself
    newUserDetails,
    {
      new: true, // new value true
      runValidato$true, // validate
      useFindAndModify: false, // This is false because by default mongodb do find and do some change maybe
    }
  );

  res.status(200).json({
    success: true,
    updatedUser,
  });
});

// Delete User
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  // We will remove avatar etc later.

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`No user found with id ${req.params.id}`));
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Successfully Deleted User",
  });
});
