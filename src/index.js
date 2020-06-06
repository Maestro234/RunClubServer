//execute just once
require("./models/User");
require("./models/Run");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//import routes
const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middlewares/requireAuth");
const trackruns = require("./routes/trackRuns");

const server = express();

server.use(bodyParser.json());
server.use(authRoutes);
server.use(trackruns);

const mongoUri =
  "mongodb+srv://admin:admin@cluster0-ncwr7.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

//let me know if connection successful
mongoose.connection.on("connected", () => {
  console.log("connection to mongo successful");
});

//let me know is error during connecrion
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

//base uri - can access if user has valid token
server.get("/", requireAuth, (request, response) => {
  response.send(`your email: ${request.user.email}`);
});

server.listen(3000, () => {
  console.log("Listening on 3000");
});
