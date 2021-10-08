var jwt = require("jsonwebtoken");
const rhs = "rahasia";
module.exports = {
  midd: async (req, res, next) => {
    var token = await req.headers["authorization"];

    console.log(token);
    if (token) {
      try {
        const decoded = jwt.verify(token, rhs);
        req.data = decoded;
      } catch (error) {
        return res.status(401).send("Invalid Token");
      }
      return next();
    } else {
      res.render("error-page");
    }
  },
};
