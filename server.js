const app = require("./app");
const connectToDatabase = require("./controllers/db");

connectToDatabase((db) => {
    app.locals.db = db;
  
    app.listen(3000, function () {
      console.log("Server started at port 3000");
    });
  });