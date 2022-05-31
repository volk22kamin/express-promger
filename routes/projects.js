const express = require("express");
const router = express.Router();

const { ProjectsModel, validateProject } = require("../models/projectModal");
const { UserModel } = require("../models/userModel");

router.get("/", async (req, res) => {
  const data = await ProjectsModel.find();
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const data = await ProjectsModel.findOne({ _id: req.params.id });
  res.json(data);
});

// router.get("/array/:id", async (req, res) => {
//   const ids = ["6295cb16ac6e1dc8ceb49840", "6295cb1bac6e1dc8ceb49842"];
//   const projects_ar = await Promise.all(
//     ids.map(async (projectId) => {
//       console.log(projectId);
//       const data = await ProjectsModel.findOne({ _id: projectId });
//     })
//   );
//   res.json(projects_ar);
// });

router.get("/perUser/:id", async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    const projects_ar = await Promise.all(
      user.projects.map(async (projectId) => {
        return await ProjectsModel.findOne({ _id: projectId });
      })
    );
    res.json(projects_ar);
  } catch (error) {
    res.status(400).json({ error: error, msg: "user id not found" });
  }
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
