const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");


window.onload = () => {
    const savedChat = localStorage.getItem("chatHistory");
    console.log({savedChat});
    if (savedChat) chatBox.innerHTML = savedChat;
    chatBox.scrollTop = chatBox.scrollHeight;    
    }

function addMessage(message, classNme) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", classNme);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.textContent = "AI is Typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

async function getBotReply(userMessage) {
    const url ='API_KEY';

try{
    const response = await fetch(url, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: userMessage
                        }
                    ]
                }
            ]
        })
    })
    const data = await response.json();
    if(!response.ok) {
        console.error("Error fetching bot reply:", data);

        return data?.error?.message || "Unknown error"
     }

    return(data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from bot")}

catch (error) {
}
}



sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    if (message === "") return;
    addMessage(message, "user-message");
    userInput.value = ""

    const typingDiv = showTyping();
    const botReplay = await getBotReply(message); // Assuming getBotReply is a function that fetches the bot's reply
    typingDiv.remove();
    addMessage(botReplay, "bot-message");

    localStorage.setItem("chatHistory", chatBox.innerHTML);
   

}

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") 
        sendBtn.click();
})




