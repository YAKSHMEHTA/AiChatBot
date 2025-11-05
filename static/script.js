document.getElementById("send-btn").addEventListener("click", sendMessage);

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const question = input.value.trim();

  if (!question) return;
  
  chatBox.innerHTML += `<div class="message user">🧑 ${question}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  chatBox.innerHTML += `<div class="message bot">🤖 Thinking...</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  const response = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();
  chatBox.lastChild.remove();

  if (data.answer) {
    chatBox.innerHTML += `<div class="message bot">🤖 ${data.answer}</div>`;
  } else {
    chatBox.innerHTML += `<div class="message bot">❌ Error: ${data.error}</div>`;
  }
  
  chatBox.scrollTop = chatBox.scrollHeight;
}
