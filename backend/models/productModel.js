const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price cant exceed 8 characters"],
  },
  ratings: {
    // 5 star etc
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        // where we host image, it will give
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product stock"],
    maxLength: [4, "stock cant exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    // how many give review
    type: Number,
    default: 0,
  },
  reviews: [
    // itself review,,, what is to be in it.
    {
      user: {
        type: mongoose.Schema.ObjectId, // type from the user model or maybe this is id getting from the model of mongoose
        ref: "User", // This is ref to that model. Remind that when we export we add this as first argument.
        required: true, // as it is true so we are providing it in the create product method.
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  onRent: {
    type: Boolean,
    default: false,
  },
  onRentPrice: {
    type: String,
  },
  // For the vendor who create it.
  user: {
    type: mongoose.Schema.ObjectId, // type from the user model or maybe this is id getting from the model of mongoose
    ref: "User", // This is ref to that model. Remind that when we export we add this as first argument.
    required: true, // as it is true so we are providing it in the create product method.
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
