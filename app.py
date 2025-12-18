from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

# Use environment variable for API key
api_key = os.environ.get("OPENROUTER_API_KEY")

if not api_key:
    print("WARNING: OPENROUTER_API_KEY not found!")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500
    
    try:
        data = request.get_json()
        question = data.get("question")
        
        if not question:
            return jsonify({"error": "No question provided"}), 400

        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct:free",
            messages=[{"role": "user", "content": question}],
            temperature=0.7
        )
        answer = response.choices[0].message.content
        return jsonify({"answer": answer})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# For Vercel serverless functions
app = app