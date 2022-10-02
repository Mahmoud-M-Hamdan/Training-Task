const mongoose = require("mongoose");
const { schema } = require("./user");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
