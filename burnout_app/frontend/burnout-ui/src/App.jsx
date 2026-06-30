import { useState, useEffect, useRef } from "react";

// ─── Design tokens ──────────────────────────────────────────────
const C = {
  bg:       "#0A0B0F",
  surface:  "#111318",
  card:     "#161A22",
  border:   "#1E2330",
  accent:   "#6C63FF",
  accentDim:"#6C63FF22",
  low:      "#22C55E",
  moderate: "#F59E0B",
  high:     "#EF4444",
  text:     "#E8EAF0",
  muted:    "#6B7280",
  subtle:   "#9CA3AF",
};

// ─── Inline styles ───────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "0 0 80px 0",
  },
  hero: {
    textAlign: "center",
    padding: "64px 24px 40px",
    position: "relative",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: C.accent,
    marginBottom: 16,
    fontWeight: 600,
  },
  title: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 16,
    background: `linear-gradient(135deg, ${C.text} 0%, ${C.accent} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: C.muted,
    fontSize: 16,
    maxWidth: 480,
    margin: "0 auto 48px",
    lineHeight: 1.6,
  },
  form: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "0 20px",
  },
  section: {
    marginBottom: 32,
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "18px 24px",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.subtle,
  },
  fields: {
    padding: "20px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  fieldSingle: {
    padding: "20px 24px",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: C.muted,
    fontWeight: 500,
    letterSpacing: "0.04em",
  },
  input: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: C.text,
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  sliderWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  sliderVal: {
    minWidth: 28,
    textAlign: "right",
    fontSize: 14,
    fontWeight: 700,
    color: C.accent,
  },
  slider: {
    flex: 1,
    accentColor: C.accent,
    cursor: "pointer",
  },
  toggle: {
    display: "flex",
    gap: 8,
  },
  toggleBtn: (active) => ({
    flex: 1,
    padding: "10px 0",
    borderRadius: 8,
    border: `1px solid ${active ? C.accent : C.border}`,
    background: active ? C.accentDim : C.surface,
    color: active ? C.accent : C.muted,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.18s",
  }),
  submitBtn: (loading) => ({
    width: "100%",
    padding: "16px",
    borderRadius: 12,
    border: "none",
    background: loading
      ? C.border
      : `linear-gradient(135deg, ${C.accent}, #9C6FFF)`,
    color: loading ? C.muted : "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: 8,
    letterSpacing: "0.04em",
    transition: "all 0.2s",
    boxShadow: loading ? "none" : `0 4px 24px ${C.accent}44`,
  }),
};

// ─── Slider field ────────────────────────────────────────────────
function SliderField({ label, name, min = 1, max = 10, step = 1, value, onChange }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <div style={S.sliderWrap}>
        <div style={S.sliderRow}>
          <input
            type="range" min={min} max={max} step={step}
            style={S.slider}
            value={value}
            onChange={e => onChange(name, parseFloat(e.target.value))}
          />
          <span style={S.sliderVal}>{value}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle field ─────────────────────────────────────────────────
function ToggleField({ label, name, value, onChange }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <div style={S.toggle}>
        <button style={S.toggleBtn(value === 0)} onClick={() => onChange(name, 0)}>No</button>
        <button style={S.toggleBtn(value === 1)} onClick={() => onChange(name, 1)}>Yes</button>
      </div>
    </div>
  );
}

// ─── Number input ────────────────────────────────────────────────
function NumField({ label, name, value, onChange, min, max, step = 1 }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <input
        type="number" min={min} max={max} step={step}
        style={S.input}
        value={value}
        onChange={e => onChange(name, parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

// ─── Select field ─────────────────────────────────────────────────
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <select style={S.select} value={value} onChange={e => onChange(name, e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────
function ResultCard({ result, onReset }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 30); }, []);

  const color = result.prediction === "High" ? C.high
              : result.prediction === "Moderate" ? C.moderate
              : C.low;

  const emoji = result.prediction === "High" ? "🔴"
              : result.prediction === "Moderate" ? "🟡"
              : "🟢";

  const message = result.prediction === "High"
    ? "High burnout risk detected. Immediate attention to workload and mental health is recommended."
    : result.prediction === "Moderate"
    ? "Moderate burnout risk. Some stress indicators are elevated — monitoring is advised."
    : "Low burnout risk. Current conditions appear healthy and sustainable.";

  return (
    <div style={{
      maxWidth: 760,
      margin: "32px auto 0",
      padding: "0 20px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        background: C.card,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: `0 0 60px ${color}18`,
      }}>
        {/* Top bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${color}44)`,
        }} />

        <div style={{ padding: "40px 36px" }}>
          {/* Headline */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
            <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>
              Burnout Risk Level
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color, lineHeight: 1 }}>
              {result.prediction}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 16, maxWidth: 420, margin: "16px auto 0", lineHeight: 1.6 }}>
              {message}
            </div>
          </div>

          {/* Confidence */}
          <div style={{
            background: C.surface,
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Model Confidence</span>
              <span style={{ fontSize: 14, fontWeight: 700, color }}>{result.confidence}%</span>
            </div>
            <div style={{ height: 6, background: C.border, borderRadius: 99 }}>
              <div style={{
                height: "100%",
                width: `${result.confidence}%`,
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: 99,
                transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </div>
          </div>

          {/* Probabilities */}
          <div style={{
            background: C.surface,
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              Class Probabilities
            </div>
            {Object.entries(result.probabilities).map(([cls, pct]) => {
              const c = cls === "High" ? C.high : cls === "Moderate" ? C.moderate : C.low;
              return (
                <div key={cls} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: C.subtle }}>{cls}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 99 }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: c,
                      borderRadius: 99,
                      transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onReset}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.subtle,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ← Run another assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
const DEFAULTS = {
  age: 30,
  gender: "Male",
  job_role: "Developer",
  industry: "Tech",
  experience_years: 5,
  work_hours_per_week: 45,
  overtime_hours: 5,
  meetings_per_day: 4,
  deadlines_missed: 1,
  remote_work: 0,
  stress_level: 5,
  anxiety_score: 5,
  depression_score: 4,
  burnout_score: 4,
  manager_support: 6,
  social_support_score: 6,
  work_life_balance: 5,
  job_satisfaction: 6,
  sleep_hours: 7,
  physical_activity_days: 3,
  caffeine_intake: 2,
  has_therapy: 0,
  seeks_professional_help: 0,
};

const API_URL = "https://employee-burnout-predictor-ov77.onrender.com"

export default function App() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0); // animate in sections

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < 5 ? s + 1 : s));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const set = (name, val) => setForm(f => ({ ...f, [name]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not reach the API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = (i) => ({
    ...S.section,
    opacity: step > i ? 1 : 0,
    transform: step > i ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`,
  });

  if (result) return (
    <div style={S.app}>
      <div style={S.hero}>
        <div style={S.eyebrow}>Assessment Complete</div>
        <h1 style={S.title}>Your Results</h1>
      </div>
      <ResultCard result={result} onReset={() => setResult(null)} />
    </div>
  );

  return (
    <div style={S.app}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 300, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${C.accent}10 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div style={S.hero}>
          <div style={S.eyebrow}>Powered by LightGBM · AUC 0.96</div>
          <h1 style={S.title}>Burnout Risk Predictor</h1>
          <p style={S.subtitle}>
            Answer a few questions about your work and wellbeing.
            The model assesses your burnout risk across three levels.
          </p>
        </div>

        <div style={S.form}>

          {/* Section 1 — Personal */}
          <div style={sectionStyle(0)}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>👤</span>
              <span style={S.sectionTitle}>Personal Info</span>
            </div>
            <div style={S.fields}>
              <NumField label="Age" name="age" value={form.age} onChange={set} min={20} max={65} />
              <SelectField label="Gender" name="gender" value={form.gender} onChange={set}
                options={["Male", "Female", "Non-binary"]} />
              <SelectField label="Job Role" name="job_role" value={form.job_role} onChange={set}
                options={["Developer", "Manager", "Designer", "Analyst", "HR", "Other"]} />
              <SelectField label="Industry" name="industry" value={form.industry} onChange={set}
                options={["Tech", "Healthcare", "Finance", "Education", "Other"]} />
              <NumField label="Years of Experience" name="experience_years" value={form.experience_years} onChange={set} min={0} max={40} />
            </div>
          </div>

          {/* Section 2 — Work */}
          <div style={sectionStyle(1)}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>💼</span>
              <span style={S.sectionTitle}>Work Conditions</span>
            </div>
            <div style={S.fields}>
              <NumField label="Work Hours / Week" name="work_hours_per_week" value={form.work_hours_per_week} onChange={set} min={20} max={100} />
              <NumField label="Overtime Hours / Week" name="overtime_hours" value={form.overtime_hours} onChange={set} min={0} max={40} />
              <NumField label="Meetings / Day" name="meetings_per_day" value={form.meetings_per_day} onChange={set} min={0} max={20} />
              <NumField label="Deadlines Missed (monthly)" name="deadlines_missed" value={form.deadlines_missed} onChange={set} min={0} max={20} />
              <ToggleField label="Remote Work" name="remote_work" value={form.remote_work} onChange={set} />
            </div>
          </div>

          {/* Section 3 — Mental Health */}
          <div style={sectionStyle(2)}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🧠</span>
              <span style={S.sectionTitle}>Mental Health</span>
            </div>
            <div style={S.fields}>
              <SliderField label="Stress Level (1–10)" name="stress_level" value={form.stress_level} onChange={set} />
              <SliderField label="Anxiety Score (1–10)" name="anxiety_score" value={form.anxiety_score} onChange={set} />
              <SliderField label="Depression Score (1–10)" name="depression_score" value={form.depression_score} onChange={set} />
              <SliderField label="Burnout Score (1–10)" name="burnout_score" value={form.burnout_score} onChange={set} />
              <ToggleField label="Currently in Therapy" name="has_therapy" value={form.has_therapy} onChange={set} />
              <ToggleField label="Sought Professional Help" name="seeks_professional_help" value={form.seeks_professional_help} onChange={set} />
            </div>
          </div>

          {/* Section 4 — Support & Lifestyle */}
          <div style={sectionStyle(3)}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🌿</span>
              <span style={S.sectionTitle}>Support & Lifestyle</span>
            </div>
            <div style={S.fields}>
              <SliderField label="Manager Support (1–10)" name="manager_support" value={form.manager_support} onChange={set} />
              <SliderField label="Social Support (1–10)" name="social_support_score" value={form.social_support_score} onChange={set} />
              <SliderField label="Work-Life Balance (1–10)" name="work_life_balance" value={form.work_life_balance} onChange={set} />
              <SliderField label="Job Satisfaction (1–10)" name="job_satisfaction" value={form.job_satisfaction} onChange={set} />
              <SliderField label="Sleep Hours / Night" name="sleep_hours" min={3} max={12} value={form.sleep_hours} onChange={set} />
              <SliderField label="Active Days / Week" name="physical_activity_days" min={0} max={7} value={form.physical_activity_days} onChange={set} />
              <SliderField label="Caffeine Intake (cups/day)" name="caffeine_intake" min={0} max={10} value={form.caffeine_intake} onChange={set} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: `${C.high}18`,
              border: `1px solid ${C.high}44`,
              borderRadius: 10,
              padding: "14px 18px",
              color: C.high,
              fontSize: 13,
              marginBottom: 16,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <div style={sectionStyle(4)}>
            <button
              style={S.submitBtn(loading)}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analysing…" : "Predict Burnout Risk →"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 20 }}>
            This tool is for educational purposes only and does not constitute medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
