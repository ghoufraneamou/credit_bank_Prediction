from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS    

# ---------- 1. LOAD TRAINED ARTIFACTS ----------
model = joblib.load("credit_risk_lr.pkl")
scaler = joblib.load("scaler.pkl")
feature_names = joblib.load("feature_names.pkl")  # list of column names used in training

app = Flask(__name__)
CORS(app) 

# ---------- 2. HEALTH CHECK ----------
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"})


# ---------- 3. PREDICTION ENDPOINT ----------
@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects JSON like:
    {
      "age": 35,
      "account": 1,
      "saved_last_year": 0,
      "merchantpay_dig": 1,
      "digital_activity": 2,
      "has_remittances": 1,
      ...
    }

    Keys should match the feature names you used during training.
    Anything missing will be filled with 0.
    """

    data = request.json or {}

    # Build a 1-row vector with the **same order** as feature_names
    row = [data.get(f, 0) for f in feature_names]
    X = pd.DataFrame([row], columns=feature_names)

    # Scale & predict
    X_scaled = scaler.transform(X)
    proba = model.predict_proba(X_scaled)[0, 1]
    label = int(proba >= 0.5)  # 0 = low risk, 1 = high risk

    return jsonify({
        "risk_label": label,
        "risk_probability": float(proba)
    })


if __name__ == "__main__":
    # run backend at http://localhost:5000
    app.run(host="0.0.0.0", port=5000, debug=True)
