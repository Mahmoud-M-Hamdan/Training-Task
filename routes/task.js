const express = require("express");
const Auth = require("../middleware/auth");
const Task = require("../model/task");
const router = new express.Router();

router.get("/tasks/all", async (req, res) => {
  const tasks = await Task.find({});
  //  await req.user.populate('tasks')
  res.status(200).send(tasks);
});
router.get("/tasks/:id", Auth, async (req, res) => {
  const _id = req.params.id;
  const tasks = await Task.find({ _id: _id, owner: req.user._id });
  res.status(200).send(tasks);
});
router.get("/tasks", Auth, async (req, res) => {
  // const tasks = await Task.find({owner:req.user._id});
  const match = {};
  const sort = {};
  if (req.query.sort) {
    const [key, value] = req.query.sort.split(":");
    sort[key] = value;
  }
  if (req.query.price) {
    match.price >= req.query.price;
  }

  console.log(sort);

  await req.user.populate({
    path: "tasks",
    match,
    options: {
      sort,
    },
  });
  res.status(200).send(req.user.tasks);
});

router.post("/tasks", Auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  await task.save();
  res.send(task);
});

router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  await Task.findByIdAndDelete(_id);

  res.send("delete Sucsessfully");
});

router.patch("/tasks/:id", Auth, async (req, res) => {
  const keey = Object.keys(req.body);
  const _id = req.params.id;
  try {
    let updates = await Task.findOne({ _id: _id, owner: req.user._id });
    keey.forEach((ele) => (updates[ele] = req.body[ele]));

    await updates.save();

    res.send(updates);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
