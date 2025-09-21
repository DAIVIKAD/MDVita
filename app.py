from flask import Flask, request, jsonify, render_template
import requests
import json
import os
from dotenv import load_dotenv

# ----------------- LOAD ENV -----------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateMessage?key={GEMINI_API_KEY}"

FALLBACK_SENTIMENT = {
    "mood": "Neutral",
    "emoji": "😐",
    "score": 3,
    "message": "It's okay to feel this way sometimes.",
    "suggestions": [
        "Take a short walk outside",
        "Drink some water",
        "Try a breathing exercise"
    ]
}

app = Flask(__name__, static_folder="static", template_folder="templates")

# ----------------- PAGES -----------------
@app.route("/")
@app.route("/index.html")
def index():
    return render_template("index.html")

@app.route("/dashboard")
@app.route("/dashboard.html")
def dashboard():
    return render_template("dashboard.html")

@app.route("/discover")
@app.route("/discover.html")
def discover():
    return render_template("discover.html")

@app.route("/games")
@app.route("/games.html")
def games():
    return render_template("games.html")

@app.route("/profile")
@app.route("/profile.html")
def profile():
    return render_template("profile.html")

@app.route("/journal")
@app.route("/journal.html")
def journal():
    return render_template("journal.html")

# ----------------- ANALYZE ENDPOINT -----------------
@app.route("/analyze", methods=["POST"])
def analyze_journal():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"success": False, "error": "No text provided"}), 400

    prompt = f"""
    Analyze the sentiment of the following journal entry. 
    Return JSON with keys: 
      mood (Positive, Neutral, Negative), 
      emoji, 
      score (1-5), 
      message (short supportive), 
      suggestions (list of 3 concise supportive tips).

    Entry:
    {text}
    """

    payload = {
        "prompt": [{"author": "user", "content": [{"type": "text", "text": prompt}]}],
        "temperature": 0.2,
        "max_output_tokens": 500,
        "candidate_count": 1
    }

    try:
        response = requests.post(GEMINI_API_URL, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        output_text = result.get("candidates", [{}])[0].get("content", [{}])[0].get("text", "")

        try:
            sentiment = json.loads(output_text)
        except Exception:
            sentiment = FALLBACK_SENTIMENT

        return jsonify({"success": True, "sentiment": sentiment, "api_down": False})

    except Exception as e:
        return jsonify({"success": True, "sentiment": FALLBACK_SENTIMENT, "api_down": True, "error": str(e)}), 500

# ----------------- FIREBASE CONFIG ROUTE -----------------
@app.route("/firebase-config")
def firebase_config():
    config = {
        "apiKey": os.getenv("FIREBASE_API_KEY"),
        "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
        "projectId": os.getenv("FIREBASE_PROJECT_ID"),
        "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
        "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
        "appId": os.getenv("FIREBASE_APP_ID"),
        "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    }
    return jsonify(config)

# ----------------- RUN APP -----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
