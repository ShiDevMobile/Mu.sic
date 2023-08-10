const express = require("express");
const users = require("../../dev-data/users.json");
const jwt = require("jsonwebtoken");
const homeRouter = express.Router();
const bcrypt = require("bcrypt");
const privateKey = "day-la-private-key";
const fs = require("fs");
const uuid = require("uuid");

function createJwt(id) {
    return jwt.sign(id, privateKey);
}
homeRouter
    .route("/login")
    .get(function (req, res, next) {
        res.render("pages/user/signinPage");
    })
    .post(async function (req, res, next) {
        const [email, pass] = req.body;
        // for (const user of users) {
        //     user.password = await bcrypt.hash(user.password, 10);
        // }
        // fs.writeFile("/home/tuhan/Mu.sic/dev-data/users.json", JSON.stringify(users), (err) => {
        //     if (err) throw err;
        // });
        const user = users.find((user) => user.email === email);
        if (!user)
            return res.status(404).json({
                status: "fail",
                msg: "Check your email and password.",
            });
        const result = await bcrypt.compare(pass, user.password);
        if (!result)
            return res.status(404).json({
                status: "fail",
                msg: "Email and password is not valid.",
            });
        res.status(201).json({
            status: "success",
            token: createJwt(user.id),
            msg: "Wait for we log you in.",
        });
    });
homeRouter
    .route("/signup")
    .get(function (req, res, next) {
        res.render("pages/user/signUpPage");
    })
    .post(async function (req, res, next) {
        const { email, password, username, repeatPassword } = req.body;
        // for (const user of users) {
        //     user.password = await bcrypt.hash(user.password, 10);
        // }
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.id = await crypto.randomUUID();
        users.push(req.body);
        fs.writeFile("/home/tuhan/Mu.sic/dev-data/users.json", JSON.stringify(users), (err) => {
            if (err) throw err;
        });
        console.log(uuid.v4());
        res.status(201).json({
            status: "success",
            token: createJwt(uuid.v4()),
            msg: "It's done! Redirect to login",
        });
    });
homeRouter.route("/").get(function (req, res, next) {
    res.render("pages/user/homePage");
});

module.exports = homeRouter;
