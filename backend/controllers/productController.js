const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create a Product --vendor

exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  req.body.user = req.user.id; // req.user is save by us while checking isAuthenticated or not. we are accessing id and storing it in the body of product which is made by admin with user as we define it in the model of product.
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product, // for showing in postman
  });
});

// For Getting All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const resultsPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);

  //   let products = await apiFeature.query;

  // let filteredProductsCount = products.length;

  // apiFeature.pagination(resultsPerPage);

  // products = await apiFeature.query;

  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultsPerPage,
    // filteredProductsCount: action.payload.filteredProductsCount,
  });
});

// Get Admin Products

exports.getAdminProducts = async (req, res) => {
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
};

// Single Product Details

exports.getSingleProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// For Update Product --Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  // Images Start Here

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // After new true If you set `new: true`, `findOneAndUpdate()` will instead give you the object after `update` was applied. and can show this obj in console.
    runValidato$true, // Set to `true` to automatically sanitize potentially unsafe user-generated query
    useFindAndModify: false, // It is mentioned in the mongodb docs that set it to false. Why? Because we can use native findByIdAndUpdate rather than find and modify which is by default true.
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product --Admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  // Deleting Images from Cloudinary

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.delete(); // because here after getting single product we can apply the delete function on it.

  res.status(200).json({
    success: true,
    product,
  });
});

// Create and Update Reviews
exports.createProductReviews = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user.id, // If not working and error is about id then you can try req.user._id
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  // Getting product by id
  const product = await Product.findById(productId);
  // Checking either the same user reviewed this product before or not.
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString() // If not working and error is about id then you can try req.user._id
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      // Checking review of current user so that we can update it
      if (rev.user.toString() === req.user.id.toString()) {
        // If not working and error is about id then you can try req.user._id
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Now setting rating which is average of all ratings.
  let avg = 0;
  product.reviews.forEach((re) => {
    avg += Number(re.rating); // Getting Total
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler(" Product not Found ", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler(" Product not found ", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },

    {
      new: true,
      runValidato$true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
