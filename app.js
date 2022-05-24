const express = require("express");

const taskRouter = require("./routes/tasks");
const userRouter = require("./routes/users");

const path = require("path");
const http = require("http");
const cors = require("cors");

require("./db/mongoConnect");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use("/tasks", taskRouter);
app.use("/users", userRouter);

const server = http.createServer(app);

const port = process.env.PORT || "3002";

server.listen(port);
