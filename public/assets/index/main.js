const SOCKET_ADDRESS = `ws://localhost:3000`;

const socket = io(SOCKET_ADDRESS);

const modal = document.getElementById("modal");
const form = document.getElementById("form");
const messageBlock = document.getElementById("message-block");

//Emoji change mechanism
const emojiIcon = document.getElementById("emoji-icon");
const arrayOfEmojis = [
  "&#x1F355;",
  "&#x1F602;",
  "&#x1F60A;",
  "&#x1F60D;",
  "&#x1F60E;",
  "&#x1F31F;",
];

emojiIcon.innerHTML =
  arrayOfEmojis[Math.floor(Math.random() * arrayOfEmojis.length)];

setInterval(() => {
  emojiIcon.innerHTML =
    arrayOfEmojis[Math.floor(Math.random() * arrayOfEmojis.length)];
}, 5000);

//Set username if does not exist
window.addEventListener("load", (event) => {
  if (localStorage.getItem("username") === null) {
    modal.classList.remove("modal-invisible");
  } else {
    modal.classList.add("modal-invisible");
    socket.emit("join-user", localStorage.getItem("username"));
    messageBlock.appendChild(
      createNotificationBox(`User ${localStorage.getItem("username")} joined!`)
    );
  }
  document.getElementById("submit-button").disabled = true;
});

//Change username
const modalSettings = document.getElementById("modal-settings");
const settingsButton = document.getElementById("settings");
const closeSettings = document.getElementById("close-settings");
const settingsForm = document.getElementById("settings-form");

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let prevUsername = localStorage.getItem("username");
  let newUsername = document.getElementById("change-username").value;
  localStorage.setItem("username", newUsername);
  document.getElementById("change-username").value = "";
  let obj = {
    prev: prevUsername,
    new: newUsername,
  };
  socket.emit("change-username", obj);
  messageBlock.appendChild(
    createNotificationBox(`User ${obj.prev} changed username to ${obj.new}`)
  );
  modalSettings.classList.remove("modal-settings-visible");
});

settingsButton.addEventListener("click", () => {
  modalSettings.classList.add("modal-settings-visible");
  document.getElementById("change-username").value =
    localStorage.getItem("username");
});

closeSettings.addEventListener("click", () => {
  modalSettings.classList.remove("modal-settings-visible");
  document.getElementById("change-username").value = "";
});

//Modal
form.addEventListener("submit", (event) => {
  event.preventDefault();
  let username = document.getElementById("username").value;
  localStorage.setItem("username", username);
  modal.classList.add("modal-invisible");
  socket.emit("join-user", localStorage.getItem("username"));
  messageBlock.appendChild(
    createNotificationBox(`User ${localStorage.getItem("username")} joined!`)
  );
});

//Emoji modal
const button = document.getElementById("open-emoji");
const emojiModal = document.getElementById("emoji-modal");
const emojiPicker = document.querySelector("emoji-picker");
const closeEmojiModal = document.getElementById("close-modal");
emojiPicker.addEventListener("emoji-click", (event) => {
  let emoji = event.detail.unicode;
  emojiModal.classList.remove("emoji-modal-visible");
  document.getElementById("message-content").value += emoji;
  submitButton.disabled = false;
  emojiModal.classList.remove("emoji-modal-visible");
});

button.addEventListener("click", (event) => {
  emojiModal.classList.add("emoji-modal-visible");
});

closeEmojiModal.addEventListener("click", (event) => {
  emojiModal.classList.remove("emoji-modal-visible");
});

//Send message
const messageForm = document.getElementById("message-form");
const messageText = document.getElementById("message-content");
const submitButton = document.getElementById("submit-button");
messageText.addEventListener("input", (event) => {
  if (event.target.value.length === 0) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let username = localStorage.getItem("username");
  let message = document.getElementById("message-content").value;
  let messageObj = {
    username,
    message,
  };
  socket.emit("send-message", messageObj);
  document.getElementById("message-content").value = "";
  submitButton.disabled = true;
  messageBlock.appendChild(createMessageBox(messageObj));
  messageBlock.scrollTo({ top: messageBlock.scrollHeight, behavior: "smooth" });
});

//Socket events
socket.on("message-incoming", (message) => {
  messageBlock.appendChild(createMessageBox(message));
  messageBlock.scrollTo({ top: messageBlock.scrollHeight, behavior: "smooth" });
});

socket.on("user-joined", (username) => {
  messageBlock.appendChild(createNotificationBox(`User ${username} joined!`));
  messageBlock.scrollTo({ top: messageBlock.scrollHeight, behavior: "smooth" });
});

socket.on("user-left", (username) => {
  messageBlock.appendChild(
    createNotificationBox(`User ${username} left chat...`)
  );
  messageBlock.scrollTo({ top: messageBlock.scrollHeight, behavior: "smooth" });
});

socket.on("username-changed", (str) => {
  messageBlock.appendChild(createNotificationBox(str));
  messageBlock.scrollTo({ top: messageBlock.scrollHeight, behavior: "smooth" });
});

//DOM Creators
function createMessageBox({ username, message }) {
  let messageCard = document.createElement("div");
  messageCard.classList.add("message-card");
  let un = document.createElement("p");
  let txt = document.createElement("p");
  un.classList.add("username");
  txt.classList.add("text");
  un.innerHTML = username;
  txt.innerHTML = message;
  messageCard.append(un);
  messageCard.append(txt);
  return messageCard;
}

function createNotificationBox(notificationText) {
  let notificiationCard = document.createElement("div");
  notificiationCard.classList.add("notification-card");
  let text = document.createElement("p");
  text.innerHTML = notificationText;
  notificiationCard.appendChild(text);
  return notificiationCard;
}
