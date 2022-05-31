const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfasefs$$WT#T#$T#$T$#^%GESG$%U*&^IVSDGRTG$E%";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  projects: [],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
});

exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (id, email) => {
  const token = jwt.sign({ id: id, email: email }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

exports.validateUser = (reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().min(2).max(25).required().email(),
    password: Joi.string().min(6).max(25).required(),
    isAdmin: Joi.boolean(),
    projects: Joi.array(),
    _id: Joi.string(),
    __v: Joi.number(),
  });
  return joiSchema.validate(reqBody);
};

exports.validateLogin = (reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(25).required().email(),
    password: Joi.string().min(6).max(25).required(),
  });
  return joiSchema.validate(reqBody);
};
