const socket = io(`ws://localhost:3000`);

const modal = document.getElementById("modal");
const form = document.getElementById("form");
const messageBlock = document.getElementById("message-block")


window.addEventListener("load", (event) => {
    if(localStorage.getItem("username") === null){
        modal.classList.remove("modal-invisible")
        socket.emit("join-user", localStorage.getItem("username"))
    } else {
        modal.classList.add("modal-invisible")
    }
})
//Modal
form.addEventListener("submit", (event) => {

        event.preventDefault()
        let username = document.getElementById("username").value;
        localStorage.setItem("username", username)
        modal.classList.add("modal-invisible")
    
})

//Send message
const messageForm = document.getElementById("message-form")
const messageText = document.getElementById("message-content");
const submitButton = document.getElementById("submit-button")

messageText.addEventListener("change", (event) => {
    if(event.target.value.length === 0){
        submitButton.disabled = true;
    } else { 
        submitButton.disabled = false;
    }
})

messageForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let username = localStorage.getItem("username")
    let message = document.getElementById("message-content").value;
    let messageObj = {
        username,message
    }
    socket.emit("send-message", messageObj)
})

//Socket events
socket.on("message-incoming", message => {
    messageBlock.appendChild(createMessageBox(message))
})

socket.on("user-joined", username => {
    messageBlock.appendChild(createNotificationBox(`User ${username} joined!`))
})

//DOM Creators
function createMessageBox({username, message}) {
    console.log(username,message)
    let messageCard = document.createElement("div")
    messageCard.classList.add("message-card")
    let un =  document.createElement("p")
    let txt = document.createElement("p")
    un.classList.add("username")
    txt.classList.add("text")
    console.log(un)
    un.innerHTML = username;
    txt.innerHTML = message;
    messageCard.append(un)
    messageCard.append(txt);
    return messageCard;
}

function createNotificationBox(notificationText){
    let notificiationCard = document.createElement("div")
    notificiationCard.classList.add("notification-card");
    let text = document.createElement("p");
    text.innerHTML = notificationText;
    notificiationCard.appendChild(text);
    return notificiationCard;
}