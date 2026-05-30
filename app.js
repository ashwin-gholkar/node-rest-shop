const express = require("express");
const app = express();
const morgan = require("morgan"); //for logging the requests
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://ashwin:${encodeURIComponent(process.env.MONGO_ATLAS_PW)}@node-rest-shop-ag.urbhidl.mongodb.net/?appName=node-rest-shop-ag`,
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
mongoose.Promise = global.Promise; //to use the default promise library of node

console.log("Password:", process.env.MONGO_ATLAS_PW);

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); //to make the uploads folder publically available
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //* represetns it can be accessed from any <domain></domain>
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//registering endpoints
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

//handle errors using middlewale
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//catch all the errors and send response here in this middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
