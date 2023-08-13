const users = require("../dev-data/users.json");
const fs = require("fs");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const privateKey = "day-la-private-key";
const jwt = require("jsonwebtoken");
function createJwt(id) {
    return jwt.sign(id, privateKey);
}
module.exports.login = async function (req, res, next) {
    const [email, pass] = req.body;
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
};

module.exports.signup = async function (req, res, next) {
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
};

module.exports.renderSignup = function (req, res, next) {
    res.render("pages/user/signUpPage");
};

module.exports.renderLogin = function (req, res, next) {
    res.render("pages/user/signInPage");
};
