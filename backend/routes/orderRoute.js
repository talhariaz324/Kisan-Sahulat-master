const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(
    isAuthenticatedUser,
    authorizedRoles("admin", "vendor", "farmer"),
    getAllOrders
  );

router
  .route("/admin/order/:id")
  .put(
    isAuthenticatedUser,
    authorizedRoles("admin", "vendor", "farmer"),
    updateOrder
  )
  .delete(
    isAuthenticatedUser,
    authorizedRoles("admin", "vendor", "farmer"),
    deleteOrder
  );

module.exports = router;
