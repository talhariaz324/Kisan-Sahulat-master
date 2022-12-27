import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";

const Dashboard = ({ user }) => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);

  const { orders } = useSelector((state) => state.allOrders);

  const { users } = useSelector((state) => state.allUsers);
  // const { loading, error, user } = useSelector((state) => state.userDetails);
  let outOfstock = 0;
  let storeFindings = [];
  let uniqueFindings = [];
  let moreThan2 = [];
  let noMatch = [];
  let filterOrders = [];
  let orderDetails = [];
  const orderedProductsIds = [];
  const filterProducts =
    products && products.filter((product) => product.user === user._id);
  orders &&
    orders.filter((order) =>
      order.orderItems.map(
        (product) => orderedProductsIds.push(product.product),
        orderDetails.push(order)
      )
    );
  // console.log(orderDetails);
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
                  (newOrderItem.totalPrice =
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
  // console.log(uniqueFindings);

  if (user.role === "admin") {
    products &&
      products.forEach((item) => {
        if (item.stock === 0) {
          outOfstock += 1;
        }
      });
  } else {
    filterProducts &&
      filterProducts.forEach((item) => {
        if (item.stock === 0) {
          outOfstock += 1;
        }
      });
  }

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  // console.log(orders);
  if (user.role === "admin") {
    orders &&
      orders.forEach((item) => {
        totalAmount += item.totalPrice;
      });
  } else {
    // console.log(filterOrders);
    uniqueFindings &&
      uniqueFindings.forEach((item) => {
        totalAmount += item.totalPrice;
      });
  }
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["#097969"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, 4000],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of stock", "Instock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [
          (outOfstock,
          user.role === "admin"
            ? products.length - outOfstock
            : filterProducts.length - outOfstock),
        ],
        // data: [2, 10],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar user={user} />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              {user.role === "admin"
                ? "TOTAL AMOUNT (All Orders) "
                : "TOTAL AMOUNT"}{" "}
              <br /> ${totalAmount}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>
                {user.role === "admin"
                  ? products && products.length
                  : filterProducts && filterProducts.length}
              </p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>

              <p>
                {user.role === "admin"
                  ? orders && orders.length
                  : uniqueFindings && uniqueFindings.length}
              </p>
            </Link>
            {/* <Link to="/admin/orders">
              <p>Admin Orders</p>

              <p>{uniqueFindings && uniqueFindings.length}</p>
            </Link> */}

            {user.role === "admin" ? (
              <Link to="/admin/users">
                <p>Users</p>

                <p> {users && users.length} </p>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
