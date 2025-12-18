from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"  
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question")

    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct:free",
            messages=[{"role": "user", "content": question}],
            temperature=0.7
        )
        answer = response.choices[0].message.content
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)

