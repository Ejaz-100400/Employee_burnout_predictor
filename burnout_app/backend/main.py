from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
import os

app = FastAPI(title="Burnout Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-name.vercel.app",
        "http://localhost:5173"  # keep for local dev
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
MODEL_PATH = os.path.join(os.path.dirname(__file__), "lightgbm_burnout.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "scaler.pkl")
LABEL_PATH = os.path.join(os.path.dirname(__file__), "label_encoders.pkl")

model = None
scaler = None
label_encoders = None

@app.on_event("startup")
def load_artifacts():
    global model, scaler, label_encoders
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        label_encoders = joblib.load(LABEL_PATH)
        print("✅ Model artifacts loaded successfully")
    except FileNotFoundError as e:
        print(f"⚠️  Artifact not found: {e}. Run save_model.py first.")


class PredictRequest(BaseModel):
    # Demographics
    age: float
    gender: str                        # Male / Female / Non-binary
    job_role: str                      # Developer / Manager / Designer / Analyst / HR / Other
    industry: str                      # Tech / Healthcare / Finance / Education / Other
    experience_years: float

    # Work
    work_hours_per_week: float
    overtime_hours: float
    meetings_per_day: float
    deadlines_missed: float
    remote_work: int                   # 0 or 1

    # Mental Health
    stress_level: float                # 1-10
    anxiety_score: float               # 1-10
    depression_score: float            # 1-10
    burnout_score: float               # 1-10

    # Support & Lifestyle
    manager_support: float             # 1-10
    social_support_score: float        # 1-10
    work_life_balance: float           # 1-10
    job_satisfaction: float            # 1-10
    sleep_hours: float
    physical_activity_days: float      # 0-7
    caffeine_intake: float             # cups/day
    has_therapy: int                   # 0 or 1
    seeks_professional_help: int       # 0 or 1


CATEGORICAL_COLS = ["gender", "job_role", "industry", "experience_group", "age_groups"]

SCALER_COLS = [
    "age", "experience_years", "work_hours_per_week", "meetings_per_day",
    "sleep_hours", "overtime_hours", "stress_level", "anxiety_score", "depression_score",
    "social_support_score", "manager_support", "work_life_balance", "job_satisfaction",
    "physical_activity_days", "caffeine_intake", "stress_workload", "total_work_hours"
]

FEATURE_COLS = [
    "age", "gender", "job_role", "industry", "experience_years",
    "work_hours_per_week", "meetings_per_day", "sleep_hours", "overtime_hours",
    "remote_work", "stress_level", "anxiety_score", "depression_score",
    "burnout_score", "has_therapy", "seeks_professional_help",
    "manager_support", "social_support_score", "work_life_balance",
    "job_satisfaction", "physical_activity_days", "caffeine_intake",
    "deadlines_missed",
    # engineered
    "total_work_hours", "workload_intensity", "meeting_density",
    "mental_health_score", "support_score", "recovery_score",
    "stress_workload", "sleep_deficit",
    "experience_group", "age_groups"
]


def preprocess(data: PredictRequest) -> np.ndarray:
    # --- Feature Engineering (mirrors notebook) ---
    total_work_hours   = data.work_hours_per_week + data.overtime_hours
    workload_intensity = data.meetings_per_day * data.deadlines_missed
    meeting_density    = data.meetings_per_day / (data.work_hours_per_week / 5 + 0.1)
    mental_health_score= (data.anxiety_score + data.depression_score + data.stress_level) / 3
    support_score      = (data.manager_support + data.social_support_score) / 2
    recovery_score     = (data.sleep_hours + data.physical_activity_days) / 2
    stress_workload    = data.stress_level * data.work_hours_per_week
    sleep_deficit      = data.overtime_hours / data.sleep_hours if data.sleep_hours > 0 else 0

    # Age group
    age = data.age
    if age <= 30:
        age_group = "20s"
    elif age <= 40:
        age_group = "30s"
    elif age <= 50:
        age_group = "40s"
    else:
        age_group = "50s"

    # Experience group
    exp = data.experience_years
    if exp <= 3:
        exp_group = "Junior"
    elif exp <= 7:
        exp_group = "Mid"
    elif exp <= 12:
        exp_group = "Senior"
    else:
        exp_group = "Expert"

    row = {
        "age": data.age,
        "gender": data.gender,
        "job_role": data.job_role,
        "industry": data.industry,
        "experience_years": data.experience_years,
        "work_hours_per_week": data.work_hours_per_week,
        "meetings_per_day": data.meetings_per_day,
        "sleep_hours": data.sleep_hours,
        "overtime_hours": data.overtime_hours,
        "remote_work": data.remote_work,
        "stress_level": data.stress_level,
        "anxiety_score": data.anxiety_score,
        "depression_score": data.depression_score,
        "burnout_score": data.burnout_score,
        "has_therapy": data.has_therapy,
        "seeks_professional_help": data.seeks_professional_help,
        "manager_support": data.manager_support,
        "social_support_score": data.social_support_score,
        "work_life_balance": data.work_life_balance,
        "job_satisfaction": data.job_satisfaction,
        "physical_activity_days": data.physical_activity_days,
        "caffeine_intake": data.caffeine_intake,
        "deadlines_missed": data.deadlines_missed,
        "total_work_hours": total_work_hours,
        "workload_intensity": workload_intensity,
        "meeting_density": meeting_density,
        "mental_health_score": mental_health_score,
        "support_score": support_score,
        "recovery_score": recovery_score,
        "stress_workload": stress_workload,
        "sleep_deficit": sleep_deficit,
        "experience_group": exp_group,
        "age_groups": age_group,
    }

    # Label encode categoricals
    for col in CATEGORICAL_COLS:
        if label_encoders and col in label_encoders:
            le = label_encoders[col]
            val = row[col]
            if val in le.classes_:
                row[col] = int(le.transform([val])[0])
            else:
                row[col] = 0
        else:
            # Fallback simple encoding
            row[col] = 0

    # Build feature vector in correct order
    features = [row[col] for col in FEATURE_COLS]
    X = np.array(features, dtype=float).reshape(1, -1)

    # Scale
    if scaler:
        scaler_indices = [FEATURE_COLS.index(c) for c in SCALER_COLS if c in FEATURE_COLS]
        X[0, scaler_indices] = scaler.transform(X[:, scaler_indices])[0]

    return X


@app.post("/predict")
def predict(data: PredictRequest):
    if model is None:
        raise HTTPException(503, "Model not loaded. Run save_model.py first.")

    X = preprocess(data)
    pred = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    classes = model.classes_

    # Map numeric class codes back to their string labels
    # 0 -> High, 1 -> Low, 2 -> Moderate (from LabelEncoder.classes_)
    CODE_TO_LABEL = {0: "High", 1: "Low", 2: "Moderate"}

    proba_dict = {
        CODE_TO_LABEL.get(int(cls), str(cls)): round(float(p) * 100, 1)
        for cls, p in zip(classes, proba)
    }

    label = CODE_TO_LABEL.get(int(pred), str(pred))

    return {
        "prediction": label,
        "probabilities": proba_dict,
        "confidence": round(float(max(proba)) * 100, 1)
    }


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}
