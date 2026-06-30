"""
Run this script inside your Jupyter notebook (or paste cells) AFTER training.
It saves the LightGBM model, scaler, and label encoders to disk
so the FastAPI backend can load them.

Paste and run in your notebook:
"""

import joblib

# Save model
joblib.dump(other_models["LightGBM"], "backend/lightgbm_burnout.pkl")
print("✅ Model saved → backend/lightgbm_burnout.pkl")

# Save scaler
joblib.dump(scaler, "backend/scaler.pkl")
print("✅ Scaler saved → backend/scaler.pkl")

# Save label encoders dict
joblib.dump(label, "backend/label_encoders.pkl")
print("✅ Label encoders saved → backend/label_encoders.pkl")

print("\nAll artifacts saved. You can now run the FastAPI backend.")
