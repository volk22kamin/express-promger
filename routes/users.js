const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const {
  UserModel,
  validateUser,
  validateLogin,
  genToken,
} = require("../models/userModel");
const { authToken } = require("../auth/authToken");

router.get("/", async (req, res) => {
  const data = await UserModel.find({});
  res.json(data);
});

router.get("/emails", async (req, res) => {
  const data = await UserModel.find({}, { email: 1 });
  res.json(data);
});

// check later if i really have to use a different route
router.post("/register", async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) {
    return res.json(validBody.error.details);
  }
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    const user = new UserModel(req.body);
    user.password = password;
    await user.save();
    user.password = "*****";
    const newToken = genToken(user._id, user.email);

    return res.json({ isNew: true, status: "registered", data: newToken });
    // res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "did not work" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", data: "invalid username" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const newToken = genToken(user._id, user.email);

    return res.json({ status: "ok", data: newToken });
  } else {
    return res.json({ status: "error", data: "invalid password or email" });
  }
});

router.get("/tokenLogin", authToken, async (req, res) => {
  const user = await UserModel.findOne(
    { _id: req.tokenData.id },
    { password: 0 }
  );
  // res.json({ ...user, isValidated: true });
  res.json(user);
});
module.exports = router;
