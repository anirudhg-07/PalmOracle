from flask import Flask, request, jsonify
from flask_cors import CORS
from palm_processor import process_palm
from predictor import generate_predictions

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'bmp'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Palmistry API is running"})


@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided. Please upload a palm image."}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

    try:
        image_bytes = file.read()

        if len(image_bytes) == 0:
            return jsonify({"error": "Uploaded file is empty."}), 400

        # Process the palm image
        processed = process_palm(image_bytes)
        metrics = processed["metrics"]

        # ── Threshold validation ──────────────────────────────────────────
        # Minimum thresholds for a valid palm image
        MIN_LINE_COUNT   = 5      # at least 5 detected line segments
        MIN_LONG_LINES   = 1      # at least 1 significant palm line
        MIN_EDGE_DENSITY = 0.015  # at least 1.5% of pixels must be edges

        if metrics["line_count"] < MIN_LINE_COUNT:
            return jsonify({
                "error": f"Not enough lines detected in your image ({metrics['line_count']} found, minimum {MIN_LINE_COUNT} required). Please upload a clear, well-lit photo of your open palm."
            }), 422

        if metrics["long_lines"] < MIN_LONG_LINES:
            return jsonify({
                "error": "No significant palm lines detected. Please ensure your hand is flat, open, and in focus."
            }), 422

        if metrics["edge_density"] < MIN_EDGE_DENSITY:
            return jsonify({
                "error": f"Image appears too blank or blurry (edge density: {metrics['edge_density']*100:.2f}%, minimum 1.5% required). Please upload a clear palm photo."
            }), 422
        # ─────────────────────────────────────────────────────────────────

        # Generate predictions from metrics
        predictions = generate_predictions(metrics)

        return jsonify({
            "success": True,
            "edge_image": processed["edge_image_base64"],
            "predictions": predictions,
            "metrics": metrics,
        })

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 422
    except Exception as e:
        app.logger.error(f"Processing error: {e}")
        return jsonify({"error": "An unexpected error occurred while processing your image."}), 500


if __name__ == '__main__':
    print("🔮 Palmistry API starting on http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
