import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
    element.textContent = "";
    loadInterval = setInterval(() => {
        element.textContent += ".";

        if (element.textContent === "....") {
            element.textContent = "";
        }
    }, 300);
}

function typer(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueID() {
    const timeNow = Date.now();
    const randomNumber = Math.random();
    const hexString = randomNumber.toString(16);

    return `id-${timeNow}-${hexString}`;
}

function chatStripe(isAi, value, Id) {
    return `<div class="wrapper && ${isAi && "ai"}">
		<div class="chat">
		<div class="profile">
		<img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}"/>
		</div>
		<div class="message" id="${Id}">${value}</div>
		</div>
		</div>`;
}

const handleSubmit = async (event) => {
    event.preventDefault(); // <---- This line prevent the browser from re-loading!
    const data = new FormData(form);

    // User Chat-Stripe
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
    // Clearing the prompt of the form
    form.reset();

    // Bot Chat-Stripe
    const id = generateUniqueID();
    chatContainer.innerHTML += chatStripe(true, " ", id);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(id);

    loader(messageDiv);

    // Fetch data from server
    const response = await fetch("https://apollo-fz4v.onrender.com", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            prompt: data.get("prompt"),
        }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        typer(messageDiv, parsedData);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong!";
        alert(err);
    }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});
