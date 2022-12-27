import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrderList = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { products } = useSelector((state) => state.products);
  const { error, orders } = useSelector((state) => state.allOrders);
  const orderedProductsIds = [];
  let filterOrders = [];
  let orderDetails = [];
  orders &&
    orders.filter((order) => {
      // filterOrders.push(order);
      order.orderItems.map(
        (product) => orderedProductsIds.push(product.product),
        orderDetails.push(order)
      );
      return "";
    });
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
  // console.log(filterOrders);

  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "#097969BFColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.8,
    },

    {
      field: "actions",
      flex: 0.5,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  let storeFindings = [];
  let uniqueFindings = [];
  let moreThan2 = [];
  let noMatch = [];
  user.role === "admin"
    ? orders &&
      orders.forEach((item) => {
        rows.push({
          id: item._id,
          itemsQty: item.orderItems.length,
          amount: item.totalPrice,
          status: item.orderStatus,
        });
      })
    : // trying to filter so that admin walaa add na ho
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
  console.log(uniqueFindings);
  uniqueFindings.map((orderItem) => {
    rows.push({
      id: orderItem._id,
      itemsQty: orderItem.orderItems.length,
      amount: orderItem.totalPrice,
      status: orderItem.orderStatus,
    });
    return "";
  });

  return (
    <Fragment>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
