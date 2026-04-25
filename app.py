from flask import Flask, render_template, request, jsonify, Response
import anthropic
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from generate_posts import TOPICS, SYSTEM_PROMPT, POST_PROMPT_TEMPLATE, parse_posts

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html", topics=TOPICS)


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    topic = (data or {}).get("topic", "").strip()
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return jsonify({"error": "ANTHROPIC_API_KEY not configured on server"}), 500

    def stream():
        client = anthropic.Anthropic(api_key=api_key)
        full_text = ""

        try:
            with client.messages.stream(
                model="claude-opus-4-7",
                max_tokens=4000,
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": POST_PROMPT_TEMPLATE.format(topic=topic),
                    }
                ],
            ) as s:
                for chunk in s.text_stream:
                    full_text += chunk
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"

            posts = parse_posts(full_text)
            yield f"data: {json.dumps({'done': True, 'posts': posts, 'topic': topic})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return Response(stream(), mimetype="text/event-stream")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"\n  Open on this device:  http://localhost:{port}")
    print(f"  Open on your phone:   http://<your-computer-ip>:{port}\n")
    app.run(host="0.0.0.0", port=port, debug=False)
