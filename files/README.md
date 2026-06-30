# 🔥 Burnout Predictor — FastAPI + React

A full-stack burnout risk predictor using your trained LightGBM model.

---

## Project Structure

```
burnout-app/
├── backend/
│   ├── main.py              ← FastAPI app
│   ├── save_model.py        ← Run this in your notebook to export artifacts
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx          ← React UI (drop into your Vite/CRA project)
```

---

## Step 1 — Export model artifacts from your notebook

At the end of your Jupyter notebook, paste and run:

```python
import joblib

joblib.dump(other_models["LightGBM"], "backend/lightgbm_burnout.pkl")
joblib.dump(scaler, "backend/scaler.pkl")
joblib.dump(label, "backend/label_encoders.pkl")

print("✅ Artifacts saved!")
```

This saves:
- `lightgbm_burnout.pkl` — the trained model
- `scaler.pkl` — the fitted StandardScaler
- `label_encoders.pkl` — the dict of LabelEncoders for categorical columns

---

## Step 2 — Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Test it's alive:
```
http://localhost:8000/health
```

---

## Step 3 — Run the frontend

Option A — Vite (recommended):
```bash
npm create vite@latest burnout-ui -- --template react
cd burnout-ui
# Replace src/App.jsx with the provided App.jsx
npm install
npm run dev
```

Option B — Create React App:
```bash
npx create-react-app burnout-ui
cd burnout-ui
# Replace src/App.js with the provided App.jsx (rename to App.js)
npm start
```

Frontend runs at: `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA)

---

## API

**POST** `/predict`

```json
{
  "age": 30,
  "gender": "Male",
  "job_role": "Developer",
  "industry": "Tech",
  "experience_years": 5,
  "work_hours_per_week": 50,
  "overtime_hours": 10,
  "meetings_per_day": 5,
  "deadlines_missed": 2,
  "remote_work": 1,
  "stress_level": 8,
  "anxiety_score": 7,
  "depression_score": 6,
  "burnout_score": 7,
  "manager_support": 4,
  "social_support_score": 4,
  "work_life_balance": 3,
  "job_satisfaction": 4,
  "sleep_hours": 5,
  "physical_activity_days": 1,
  "caffeine_intake": 4,
  "has_therapy": 0,
  "seeks_professional_help": 0
}
```

**Response:**
```json
{
  "prediction": "High",
  "probabilities": {
    "Low": 2.1,
    "Moderate": 18.4,
    "High": 79.5
  },
  "confidence": 79.5
}
```

---

## Notes

- The preprocessing in `main.py` exactly mirrors your notebook:
  - Same feature engineering (stress_workload, sleep_deficit, mental_health_score, etc.)
  - Same age/experience group bins
  - Same scaler columns
  - Same label encoding order
- CORS is open (`allow_origins=["*"]`) — restrict this before production
