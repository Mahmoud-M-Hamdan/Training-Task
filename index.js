const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
// const User = require("./model/user");
const jwt = require("jsonwebtoken");

require('dotenv').config()
console.log(process.env.MONGOOSE_URL) 
// const Auth = require("./middleware/auth");
const userRouter=require('./routes/user')
const taskRouter=require('./routes/task')
mongoose.connect(process.env.MONGOOSE_URL);
app.use(express.json());
app.use(userRouter)
app.use(taskRouter)
app.listen(port, () => {
  console.log(`here I am on ${port}`);
});
app.listen(port)
app.get("/", (req, res) => {
  res.send("Hello from another world");
});
