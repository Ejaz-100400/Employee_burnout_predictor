# 🔥 Employee Burnout Predictor

A full-stack machine learning application that predicts employee burnout risk — **Low**, **Moderate**, or **High** — based on work conditions, mental health indicators, and lifestyle factors.

**🔗 Live App:** [employee-burnout-predictor-gold.vercel.app](https://employee-burnout-predictor-gold.vercel.app/)

---

## 📊 Overview

This project covers the full ML lifecycle — from raw data to a deployed, interactive web app:

1. **Data exploration & feature engineering** on a 300,000-row employee wellbeing dataset
2. **Model comparison** across Logistic Regression, KNN, Random Forest, XGBoost, and LightGBM
3. **Evaluation** via accuracy, weighted/macro F1, confusion matrices, and multiclass ROC-AUC
4. **Deployment** as a FastAPI backend + React frontend, hosted on Render and Vercel

---

## 🧠 Model Performance

| Model | Macro F1 | Notes |
|---|---|---|
| Logistic Regression | Low | High accuracy but poor minority-class performance |
| KNN / Random Forest / XGBoost | Moderate | Improved over baseline |
| **LightGBM** ✅ | **Best** | Selected as final model — fast on large data, handles class imbalance via `is_unbalance=True` |

**LightGBM ROC-AUC:** 0.96 across all three classes (One-vs-Rest)

---

## 🏗️ Tech Stack

**Machine Learning**
- Python, pandas, scikit-learn
- LightGBM (final model), XGBoost, Random Forest, KNN
- SMOTE for class imbalance handling

**Backend**
- FastAPI
- Pydantic for request validation
- joblib for model serialization

**Frontend**
- React (Vite)
- Custom dark-themed UI with animated transitions
- Fetch API for backend communication

**Deployment**
- Backend → [Render](https://render.com)
- Frontend → [Vercel](https://vercel.com)

---

## 📁 Project Structure

```
burnout_app/
├── burnout_predictor.ipynb     # Full ML pipeline: EDA → training → evaluation
├── backend/
│   ├── main.py                 # FastAPI app + preprocessing pipeline
│   ├── save_model.py           # Exports trained model artifacts
│   ├── requirements.txt
│   ├── lightgbm_burnout.pkl    # Trained model
│   ├── scaler.pkl              # Fitted StandardScaler
│   └── label_encoders.pkl      # Categorical encoders
└── frontend/
    └── burnout-ui/
        ├── src/
        │   └── App.jsx          # React UI
        ├── package.json
        └── vite.config.js
```

---

## ⚙️ Features Used

**Demographics:** age, gender, job role, industry, experience
**Work conditions:** work hours, overtime, meetings/day, missed deadlines, remote work
**Mental health:** stress, anxiety, depression, burnout scores
**Support & lifestyle:** manager/social support, work-life balance, job satisfaction, sleep, physical activity, caffeine intake

**Engineered features:** total work hours, workload intensity, meeting density, mental health composite score, support score, recovery score, stress-workload interaction, sleep deficit, age/experience groups

---

## 🚀 Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend/burnout-ui
npm install
npm run dev
```

Update `API_URL` in `App.jsx` to `http://localhost:8000` for local development.

---

## 📡 API

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

**Response**
```json
{
  "prediction": "High",
  "probabilities": { "Low": 2.1, "Moderate": 18.4, "High": 79.5 },
  "confidence": 79.5
}
```

**GET** `/health` — service status check

---

## ⚠️ Disclaimer

This tool is for educational and demonstrative purposes only and does **not** constitute medical or clinical advice.

---

## 📌 Future Improvements

- Address class imbalance in the "Low" burnout category with more real-world data
- Add SHAP-based feature importance to explain individual predictions
- User authentication + history tracking for repeated assessments