const express = require("express");
const homeRouter = express.Router();
const { login, signup, renderSignup, renderLogin } = require("../../controllers/authController");
const { renderHomepage, getDataSongs } = require("../../controllers/homeController");

homeRouter.route("/login").get(renderLogin).post(login);
homeRouter.route("/signup").get(renderSignup).post(signup);

homeRouter.route("/").get(renderHomepage);

homeRouter.route("/songs").get(getDataSongs);
module.exports = homeRouter;
