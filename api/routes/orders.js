const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then((orders) => {
      res.status(200).json({
        message: "orders fetched successfully",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    productId: req.body.productId,
    quantity: req.body.quantity,
  });
  order
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Order created",
        createdOrder: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.findById(id)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        message: "Order fetched successfully",
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then((result) => {
      res.status(200).json({
        message: "updated order",
        id: id,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;

  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        id: id,
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
