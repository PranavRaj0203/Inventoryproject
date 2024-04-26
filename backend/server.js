const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute");
const errorHandler=require("./middleWare/errorMiddleware")
const cookieParser=require("cookie-parser");
const path = require("path");
const app = express();
//middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

//route middleware
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);

// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
});
const PORT = process.env.PORT || 5000;
//ERROR handler or middleware
app.use(errorHandler);

// connect to db and server start
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on Port ${PORT}`)
        })
    })
    .catch((err) => console.log(err))