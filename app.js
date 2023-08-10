const express = require("express");
const homeRouter = require("./routers/user/homeRouter");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);
// app.use("/admin");
app.use("*", function (req, res, next) {
    res.status(404).send("<h1>404 Not Found</h1>");
});
module.exports = app;
