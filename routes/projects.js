const express = require("express");
const router = express.Router();

const { ProjectsModel, validateProject } = require("../models/projectModal");

router.get("/", async (req, res) => {
  const data = await ProjectsModel.find();
  res.json(data);
});

router.post("/", async (req, res) => {
  const validBody = validateProject(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = new ProjectsModel(req.body);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "did not work" });
  }
});

router.put("/addUser/:idEdit", async (req, res) => {
  const validBody = validateProject(req.body);
  if (validBody.error) {
    return res.status(401).json(validBody.error.details);
  }
  try {
    const data = await ProjectsModel.updateOne(
      { _id: req.params.idEdit },
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = router;
