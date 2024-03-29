const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected...");
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server works at http://localhost:${process.env.PORT}`)
);
