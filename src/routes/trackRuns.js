require("../models/User");
const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Run = mongoose.model("Run");

const router = express.Router();

/*
 * requireauth returns request obj with with user of type User property
 */
router.use(requireAuth);

router.get("/runs", async (request, response) => {
  const runs = await Run.find({ userId: request.user._id });

  response.send(runs);
});

router.post("/record", async (request, response) => {
  //get the name and location from body
  const { name, locations } = request.body;

  if (!name || !locations) {
    return response
      .status(422)
      .send({ error: "You must provide name and locations" });
  }

  try {
    //create a run
    const run = new Run({ name, locations, userId: request.user._id });
    await run.save();
    response.send(run);
  } catch (err) {
    response.status(422).send({ error: err.message });
  }
});

module.exports = router;
