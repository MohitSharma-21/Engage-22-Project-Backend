const { User } = require("../models");
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // checks user is login or not

  if (!req.headers["authorization"]) {
    res
      .status(401)
      .send(
        "The requested page needs a username and a password and a valid token in authorization header"
      );
  } else {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
      res
        .status(401)
        .send(
          "The requested page needs a username and a password and a valid token in authorization header"
        );
    else {
      const token = authHeader.split(" ")[1];

      if (!token || token != "null") {
        jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decodedToken) => {
          if (err) {
            res
              .status(401)
              .send(
                "The requested page needs a username and a password and a valid token in authorization header"
              );
          } else {

            req.user = decodedToken.id;
            next();
            
          }
        });
      } else {
        res
          .status(401)
          .send(
            "The requested page needs a username and a password and a valid token in authorization header"
          );
      }
    }
  }
};

module.exports = { requireAuth };
