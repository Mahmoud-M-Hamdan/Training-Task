const express = require("express");
const mongoose = require("mongoose");
const app = express();
// const User = require("./model/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();
// const Auth = require("./middleware/auth");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
mongoose.connect(process.env.MONGOOSE_URL);
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(process.env.PORT || 3000, () => {
  console.log(`here I am on ${process.env.PORT}`);
});
app.get("/", (req, res) => {
  res.send("Hello from another world");
});
