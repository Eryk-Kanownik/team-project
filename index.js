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
  socket.on("send-message", message => {
    socket.broadcast.emit("message-incoming", message)
  })
  socket.on("join-user", (username) => {
    socket.broadcast.emit("user-joined", username)
  })
  socket.on("disconnect", () => {
    console.log("User disconnected...");
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server works at http://localhost:${process.env.PORT}`)
);
