const express = require("express");
const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProductDetails,
  createProductReviews,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();
// Create Product --Admin
router
  .route("/vendor/product/new")
  .post(
    isAuthenticatedUser,
    authorizedRoles("vendor", "admin", "farmer"),
    createProduct
  );
// All Products
router.route("/products").get(getAllProducts);
// Admin All products (use if needed)
router
  .route("/admin/products")
  .get(
    isAuthenticatedUser,
    authorizedRoles("admin", "vendor", "farmer"),
    getAdminProducts
  );
// Update/Delete Product --Admin
router
  .route("/vendor/product/:id")
  .put(
    isAuthenticatedUser,
    authorizedRoles("vendor", "admin", "farmer"),
    updateProduct
  )
  .delete(
    isAuthenticatedUser,
    authorizedRoles("vendor", "admin", "farmer"),
    deleteProduct
  );
// get Single Product
router.route("/product/:id").get(getSingleProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReviews); // Put because it is also updating with this same function
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview); // Put because it is also updating with this same function
module.exports = router;
