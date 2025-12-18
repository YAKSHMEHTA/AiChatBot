const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    let isFirstMessage = true;

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    function sendExample(text) {
      userInput.value = text;
      sendMessage();
    }

    async function sendMessage() {
      const question = userInput.value.trim();
      
      if (!question) return;
      
      if (isFirstMessage) {
        const welcome = chatBox.querySelector('.welcome-container');
        if (welcome) welcome.remove();
        isFirstMessage = false;
      }
      
      addMessage(question, 'user');
      userInput.value = "";
      userInput.style.height = 'auto';
      
      sendBtn.disabled = true;
      
      const thinkingMsg = addThinkingMessage();
      
      try {
        const response = await fetch("/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question })
        });
        
        const data = await response.json();
        
        thinkingMsg.remove();
        
        if (data.answer) {
          addMessage(data.answer, 'assistant');
        } else {
          addMessage(data.error || "Something went wrong. Please try again.", 'assistant', true);
        }
      } catch (error) {
        thinkingMsg.remove();
        addMessage("Failed to connect. Please check your connection and try again.", 'assistant', true);
      } finally {
        sendBtn.disabled = false;
        userInput.focus();
      }
    }

    function addMessage(text, sender, isError = false) {
      const messageRow = document.createElement("div");
      messageRow.className = `message-row ${sender}`;
      
      const wrapper = document.createElement("div");
      wrapper.className = "message-content-wrapper";
      
      const icon = document.createElement("div");
      icon.className = "message-icon";
      icon.textContent = sender === 'user' ? 'U' : 'AI';
      
      const textDiv = document.createElement("div");
      textDiv.className = `message-text${isError ? ' error-text' : ''}`;
      textDiv.textContent = text;
      
      wrapper.appendChild(icon);
      wrapper.appendChild(textDiv);
      messageRow.appendChild(wrapper);
      chatBox.appendChild(messageRow);
      
      chatBox.scrollTop = chatBox.scrollHeight;
      
      return messageRow;
    }

    function addThinkingMessage() {
      const messageRow = document.createElement("div");
      messageRow.className = "message-row assistant";
      
      const wrapper = document.createElement("div");
      wrapper.className = "message-content-wrapper";
      
      const icon = document.createElement("div");
      icon.className = "message-icon";
      icon.textContent = 'AI';
      
      const textDiv = document.createElement("div");
      textDiv.className = "message-text";
      
      const indicator = document.createElement("div");
      indicator.className = "thinking-indicator";
      
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.className = "thinking-dot";
        indicator.appendChild(dot);
      }
      
      textDiv.appendChild(indicator);
      wrapper.appendChild(icon);
      wrapper.appendChild(textDiv);
      messageRow.appendChild(wrapper);
      chatBox.appendChild(messageRow);
      
      chatBox.scrollTop = chatBox.scrollHeight;
      
      return messageRow;
    }

    function clearChat() {
      if (confirm('Are you sure you want to clear the chat history?')) {
        chatBox.innerHTML = `
          <div class="welcome-container">
            <h1 class="welcome-title">How can I help you today?</h1>
            <div class="examples">
              <div class="example-card" onclick="sendExample('Explain quantum computing in simple terms')">
                <div class="example-card-title">Explain quantum computing in simple terms</div>
              </div>
              <div class="example-card" onclick="sendExample('Help me plan a trip to Japan')">
                <div class="example-card-title">Help me plan a trip to Japan</div>
              </div>
              <div class="example-card" onclick="sendExample('Write a Python function to reverse a string')">
                <div class="example-card-title">Write a Python function to reverse a string</div>
              </div>
            </div>
          </div>
        `;
        isFirstMessage = true;
      }
    }

    userInput.focus();