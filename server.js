const app = require("./app");

const server = app.listen(3000, function () {
    console.log("Server start at port 3000");
});


process.on("uncaughtException", function (err) {
    console.log(err);
    if (err) {
        server.close();
        process.exit(1);
    }
});

process.on("unhandledRejection", function (err) {
    console.log(err);
    if (err) {
        server.close();
        process.exit(1);
    }
});
