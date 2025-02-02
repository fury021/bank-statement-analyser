import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from flask import Flask, request, jsonify

# Define categories
CATEGORIES = ["Income", "EMI", "Grocery", "Entertainment", "Transportation", "Bills", "Shopping", "Miscellaneous"]

# Load tokenizer and model
MODEL_NAME = "distilbert-base-uncased"
tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=len(CATEGORIES))

# Move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

app = Flask(__name__)

@app.route("/classify", methods=["POST"])
def classify_transaction():
    data = request.json
    description = data.get("description", "")

    if not description:
        return jsonify({"error": "Missing transaction description"}), 400

    inputs = tokenizer(description, return_tensors="pt", truncation=True, padding=True, max_length=64).to(device)

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
    predicted_category = CATEGORIES[torch.argmax(probabilities).item()]

    return jsonify({"category": predicted_category})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
