const indexR = require("./index");
const usersR = require("./users");
const drinksR = require("./drinks");
const bikesR = require("./bikes");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/drinks",drinksR);
  app.use("/bikes",bikesR);
}