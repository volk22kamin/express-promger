const express = require("express");

const taskRouter = require("./routes/tasks");

const path = require("path");
const http = require("http");
const cors = require("cors");

require("./db/mongoConnect");

const app = express();

app.use(express.json());
app.use(cors());

// app.get("/cors", (req, res) => {
//   res.set("Access-Control-Allow-Origin", "*");
//   res.send({ msg: "This has CORS enabled 🎈" });
// });

app.use(express.static(path.join(__dirname, "public")));
app.use("/tasks", taskRouter);

const server = http.createServer(app);

const port = process.env.PORT || "3002";

server.listen(port);
