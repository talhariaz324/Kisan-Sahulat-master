import "./App.css";
import Header from "./components/layout/Header/Header.js";
import Home from "./components/Home/Home.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";

import React, { Fragment, useEffect } from "react";
import Footer from "./components/layout/Footer/Footer";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search.js";
import LoginSignUp from "./components/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./components/layout/Header/UserOptions.js";
import ProtectedRoute from "./components/Route/ProtectedRoute.js";
import Profile from "./components/User/Profile.js";
import UpdateProfile from "./components/User/UpdateProfile.js";
import UpdatedPassword from "./components/User/UpdatedPassword.js";
import ForgotPassword from "./components/User/ForgotPassword.js";
import ResetPassword from "./components/User/ResetPassword.js";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder.js";
// import axios from "axios";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import Payment from "./components/Cart/Payment";
import OrderSuccess from "./components/Cart/OrderSuccess.js";
import MyOrders from "./components/Order/MyOrders.js";
import OrderDetails from "./components/Order/OrderDetails.js";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList.js";
import NewProduct from "./components/Admin/NewProduct.js";
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList";
import ProcessOrder from "./components/Admin/ProcessOrder";
import UsersList from "./components/Admin/UsersList";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from "./components/Admin/ProductReviews";
import Contact from "./components/layout/Contact/Contact.js";
import About from "./components/layout/About/About.js";
import NotFound from "./components/layout/Not Found/NotFound.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKey() {
  //   const { data } = await axios.get(`/api/v1/stripeapikey`);

  //   setStripeApiKey(data.stripeApiKey);
  // }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    // getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <div>
      <BrowserRouter>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Fragment>
          {/* <Elements stripe={loadStripe(stripeApiKey)}> */}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route
              exact
              path="/product/:id"
              element={<ProductDetails user={user} />}
            />
            <Route exact path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route exact path="/search" element={<Search />} />
            <Route exact path="/login" element={<LoginSignUp />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route exact path="/password/forgot" element={<ForgotPassword />} />
            <Route
              exact
              path="/password/reset/:token"
              element={<ResetPassword />}
            />
            <Route exact path="/cart" element={<Cart user={user} />} />

            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Profile />} />
              <Route path="/me/update" element={<UpdateProfile />} />
              <Route path="/password/update" element={<UpdatedPassword />} />
              <Route exact path="/login/shipping" element={<Shipping />} />
              <Route exact path="/order/confirm" element={<ConfirmOrder />} />
              {/* {stripeApiKey && (
                  <Route exact path="/process/payment" element={<Payment />} />
                )} */}
              <Route exact path="/success" element={<OrderSuccess />} />
              <Route exact path="/orders" element={<MyOrders />} />
              <Route exact path="/order/:id" element={<OrderDetails />} />
              <Route
                exact
                path="/admin/dashboard"
                element={<Dashboard user={user} />}
              />
              <Route
                exact
                path="/admin/products"
                element={<ProductList user={user} />}
              />
              <Route exact path="/vendor/product" element={<NewProduct />} />
              <Route
                exact
                path="/vendor/product/:id"
                element={<UpdateProduct />}
              />
              <Route
                exact
                path="/admin/orders"
                element={<OrderList user={user} />}
              />
              <Route
                exact
                path="/admin/order/:id"
                element={<ProcessOrder user={user} />}
              />
              <Route exact path="/admin/users" element={<UsersList />} />
              <Route exact path="/admin/user/:id" element={<UpdateUser />} />
              <Route exact path="/admin/reviews" element={<ProductReviews />} />
            </Route>
          </Routes>
          {/* </Elements> */}
        </Fragment>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
Redux Working:

Make store.
Make constants
Make Reducers (use them in store)
Make Actions (This is where have url)
Then 
In index.js wrap with provider (Whole wrap with one argument)
Then 
package.json of frontend add proxy with your frontend localhost to after : port of backend


After That in home.js or where you want ,,, you can use them by using some imports as you can check at the redux commit in git.



At the end,,, You have to run the backend and frontend both by spliting the terminal. 
First run backend and then frontend.... But necessary
*/
