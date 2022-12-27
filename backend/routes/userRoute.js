const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPasswordLink,
  getUserDetail,
  updatePassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPasswordLink);
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetail); // Of course,, user is viewing his profile mean he is login
router.route("/password/update").put(isAuthenticatedUser, updatePassword); // Of course,, user is viewing his profile mean he is login
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile); // Of course,, user is viewing his profile mean he is login
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers); // Of course,, user is viewing his profile mean he is login
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;
