const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

//signup endpoint
router.post("/signup", async (request, response) => {
  console.log("::::In auth route::::sign up");
  const { email, password } = request.body;

  try {
    const user = new User({ email, password });
    await user.save();

    //adding the jwt to header to response
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    response.send({ token });
  } catch (err) {
    return response.status(422).send(err.message);
  }
});

//signin endpoint
router.post("/signin", async (request, response) => {
  console.log("::::In auth route::::sign in");
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(422)
      .send({ error: "Must provide email and passowrd" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return response.status(404).send({ error: "User not found" });
  }

  try {
    await user.comparePassword(password);
    console.log("Auth Route ==== User Id from Mongo: ", user._id);
    //add jwt token to header from mongo to response
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");

    response.send({ token });
  } catch (err) {
    return response.status(422).send({ error: "Invalid email or password" });
  }
});

//function
module.exports = router;
