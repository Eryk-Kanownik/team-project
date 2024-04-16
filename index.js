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

let users = {};

io.on("connection", (socket) => {
  socket.on("send-message", (message) => {
    socket.broadcast.emit("message-incoming", message);
  });
  socket.on("join-user", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user-joined", username);
  });
  socket.on("change-username", (obj) => {
    users[socket.id] = obj.new;
    let str = `User ${obj.prev} changed username to ${obj.new}`;
    socket.broadcast.emit("username-changed", str);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server works at http://localhost:${process.env.PORT}`)
);
