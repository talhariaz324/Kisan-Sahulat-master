const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "You cannot exceed 30 characters"],
    minLength: [4, "You should have least 4 character"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid email"], // Check the email format
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater or equal to 8"],
    select: false, // In admin, when we filter users. then it will not show their password because select is false
  },
  avatar: {
    public_id: {
      // where we host image, it will give
      type: String,
      //   required: true,
    },
    url: {
      type: String,
      //   required: true,
    },
  },
  role: {
    type: String,
    required: [true, "Please Enter Your Role"],
    default: "farmer",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hashing a password in the database whenever the user created it will pass through it

// Hashing password
userSchema.pre("save", async function (next) {
  // before saving of user schema
  if (!this.isModified("password")) {
    // checking if he update password or not because then hash if he is changed.
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token for remain sign in
// Here we create method of userSchema while above pre is pre define function
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // THIS secret key is which one which allow to make token and sign in into your app. dont share with others
    expiresIn: process.env.JWT_EXPIRE, // After time it must be expire. User has to log in again with his token
  });
};

// Compare password (Login need)

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
