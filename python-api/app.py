from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoImageProcessor
from PIL import Image
import io
import base64
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Loading model...")
# Load processor and model separately
processor = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
classifier = pipeline("image-classification", model="google/vit-base-patch16-224", image_processor=processor)
logger.info("Model loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.json

        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400

        # Decode base64 image
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB and resize
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Resize to a standard size (224x224 for ViT)
        image = image.resize((224, 224))

        logger.info(f"Image prepared: size={image.size}, mode={image.mode}")
        logger.info("Classifying image...")

        # Classify
        results = classifier(image)

        # Get top result
        top_result = results[0]

        response = {
            "label": top_result['label'],
            "confidence": top_result['score']
        }

        logger.info(f"Classification result: {response}")
        return jsonify(response)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
