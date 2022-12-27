import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./processOrder.css";

const ProcessOrder = ({ user }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const { orders } = useSelector((state) => state.allOrders);
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { products } = useSelector((state) => state.products);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);

  const [status, setStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(updateOrder(id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id, isUpdated, updateError]);

  const orderedProductsIds = [];
  let filterOrders = [];
  let orderDetails = [];
  let storeFindings = [];
  let uniqueFindings = [];
  let findPrice = 0;
  let moreThan2 = [];
  let noMatch = [];
  const value = {
    name: "",
    price: 0,
    quantity: 0,
    image: "",
    product: "",
  };
  orders &&
    orders.filter((order) => {
      // filterOrders.push(order);
      order.orderItems.map(
        (product) => orderedProductsIds.push(product.product),
        orderDetails.push(order)
      );
      return "";
    });
  // console.log(orders);
  const filterOrdererdProducts = orderedProductsIds.map((id) =>
    products.filter((product) => product._id === id)
  );
  filterOrdererdProducts.map((products) =>
    products.map((product) => {
      if (product.user === user._id) {
        filterOrders.push(product);
      }
      return "";
    })
  );

  filterOrders &&
    filterOrders.forEach((pro) => {
      orderDetails.map((orderItem) =>
        orderItem.orderItems.forEach((item) => {
          if (item.product === pro._id) {
            if (orderItem.orderItems.length > 1) {
              // console.log("greater than 1");
              let newOrderItem = { ...orderItem };

              moreThan2 = newOrderItem.orderItems.filter(
                (item) => item.product === pro._id
              );
              let newNewOrderItem = { ...orderItem };
              noMatch = newNewOrderItem.orderItems.filter(
                (item) => item.product !== pro._id
              );
              newOrderItem.orderItems = moreThan2;
              noMatch.map(
                (noMatchs) =>
                  (findPrice =
                    newOrderItem.totalPrice - noMatchs.price * noMatch.length)
              );

              storeFindings.push(newOrderItem);
              uniqueFindings = storeFindings.filter(
                (checkItem, index, self) =>
                  self.findIndex((t) => t._id === checkItem._id) === index
              );
            }
            storeFindings.push(orderItem);
            uniqueFindings = storeFindings.filter(
              (checkItem, index, self) =>
                self.findIndex((t) => t._id === checkItem._id) === index
            );
          }
          return "";
        })
      );
    });
  uniqueFindings.map((orderItem) =>
    orderItem.orderItems.map((single) => {
      value.name = single.name;
      value.quantity = single.quantity;
      value.price = single.price;
      value.image = single.image;
      value.product = single.product;

      return "";
    })
  );

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display:
                  uniqueFindings.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "#097969BFColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span>
                        {user.role === "admin"
                          ? order.totalPrice && order.totalPrice
                          : findPrice && findPrice}
                      </span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order.orderStatus && order.orderStatus === "Delivered"
                            ? "#097969BFColor"
                            : "redColor"
                        }
                      >
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {user.role === "admin" ? (
                      order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image} alt="Product" />
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>{" "}
                          <span>
                            {item.quantity} X ₹{item.price} ={" "}
                            <b>₹{item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))
                    ) : (
                      <div key={value.product}>
                        <img src={value.image} alt="Product" />
                        <Link to={`/product/${value.product}`}>
                          {value.name}
                        </Link>{" "}
                        <span>
                          {value.quantity} X ₹{value.price} ={" "}
                          <b>₹{value.price * value.quantity}</b>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
