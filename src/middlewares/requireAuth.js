// this takes an incoming request
// if user has token then allow to application

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (request, response, next) => {
  console.log(":::::In requireAuth:::::");
  //authenticate user - user provides token in header
  //extract jwt and validate
  //authorization === Bearer sjdhgosbdgbslvihs;bgsihgp
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "SECRET_KEY", async (err, payload) => {
    if (err) {
      return response.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;

    //get the user from mongo
    const user = await User.findById(userId);
    //assign user to request obj
    request.user = user;
    next();
  });
};
