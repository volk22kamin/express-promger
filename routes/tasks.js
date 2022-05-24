const express = require("express");
const router = express.Router();

const { TaskModel, validateTask } = require("../models/taskModel");

router.get("/", async (req, res) => {
  const data = await TaskModel.find({});
  res.json(data);
});

router.post("/", async (req, res) => {
  const validBody = validateTask(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const data = new TaskModel(req.body);
    await data.save();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "did not work" });
  }
});

router.put("/:idEdit", async (req, res) => {
  const validBody = validateTask(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = await TaskModel.updateOne(
      { task_id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

router.delete("/:idDel", async (req, res) => {
  const data = await TaskModel.deleteOne({ task_id: req.params.idDel });
  res.json(data);
});

module.exports = router;
