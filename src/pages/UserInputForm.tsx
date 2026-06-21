import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAppStore } from "@/context/useAppStore";
import { fetchEligibleSchemes } from "@/services/api";
import type { UserProfile } from "@/types";

const TOTAL_STEPS = 4;

export default function UserInputForm() {
  const navigate = useNavigate();
  const { profile, setProfile, setResults, addHistoryItem } = useAppStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!profile.fullName.trim()) e.fullName = "Full name is required";
      if (!profile.age || +profile.age < 1 || +profile.age > 120) e.age = "Enter a valid age";
      if (!profile.gender) e.gender = "Please select gender";
    }
    if (step === 2) {
      if (!profile.state.trim()) e.state = "State is required";
      if (!profile.district.trim()) e.district = "District is required";
    }
    if (step === 3) {
      if (!profile.occupation) e.occupation = "Please select occupation";
      if (profile.annualIncome === "" || +profile.annualIncome < 0) e.annualIncome = "Enter valid annual income";
      if (!profile.category) e.category = "Please select category";
    }
    if (step === 4) {
      if (!profile.disability) e.disability = "Please select an option";
      if (!profile.student) e.student = "Please select an option";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile({ [key]: value } as Partial<UserProfile>);
  }

  function next() {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
  }
  function back() {
    setStep(Math.max(1, step - 1));
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const data = await fetchEligibleSchemes(profile);
      setResults(data);
      addHistoryItem({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        profileSnapshot: { occupation: profile.occupation, state: profile.state, category: profile.category },
        resultCount: data.schemes.length,
      });
      navigate("/results");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      <Card className="mt-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Tell us about yourself</h2>
            <Field label="Full Name" error={errors.fullName}>
              <input
                className="input-field"
                value={profile.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
            </Field>
            <Field label="Age" error={errors.age}>
              <input
                type="number"
                className="input-field"
                value={profile.age}
                onChange={(e) => handleChange("age", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Enter your age"
              />
            </Field>
            <Field label="Gender" error={errors.gender}>
              <select
                className="input-field"
                value={profile.gender}
                onChange={(e) => handleChange("gender", e.target.value as UserProfile["gender"])}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Where do you live?</h2>
            <Field label="State" error={errors.state}>
              <input
                className="input-field"
                value={profile.state}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="e.g. Uttar Pradesh"
              />
            </Field>
            <Field label="District" error={errors.district}>
              <input
                className="input-field"
                value={profile.district}
                onChange={(e) => handleChange("district", e.target.value)}
                placeholder="e.g. Agra"
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Your work and income</h2>
            <Field label="Occupation" error={errors.occupation}>
              <select
                className="input-field"
                value={profile.occupation}
                onChange={(e) => handleChange("occupation", e.target.value as UserProfile["occupation"])}
              >
                <option value="">Select occupation</option>
                <option>Farmer</option>
                <option>Student</option>
                <option>Employed</option>
                <option>Unemployed</option>
              </select>
            </Field>
            <Field label="Annual Income (₹)" error={errors.annualIncome}>
              <input
                type="number"
                className="input-field"
                value={profile.annualIncome}
                onChange={(e) => handleChange("annualIncome", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 80000"
              />
            </Field>
            <Field label="Category" error={errors.category}>
              <select
                className="input-field"
                value={profile.category}
                onChange={(e) => handleChange("category", e.target.value as UserProfile["category"])}
              >
                <option value="">Select category</option>
                <option>General</option>
                <option>SC</option>
                <option>ST</option>
                <option>OBC</option>
              </select>
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">A few more details</h2>
            <Field label="Do you have a disability?" error={errors.disability}>
              <YesNoSelect value={profile.disability} onChange={(v) => handleChange("disability", v)} />
            </Field>
            <Field label="Are you a student?" error={errors.student}>
              <YesNoSelect value={profile.student} onChange={(v) => handleChange("student", v)} />
            </Field>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={back} disabled={step === 1} className="inline-flex items-center gap-1">
            <ChevronLeft size={16} /> Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button onClick={next} className="inline-flex items-center gap-1">
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2">
              {submitting && <Loader2 className="animate-spin" size={16} />}
              {submitting ? "Checking..." : "Find Eligible Schemes"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function YesNoSelect({ value, onChange }: { value: string; onChange: (v: "Yes" | "No") => void }) {
  return (
    <div className="flex gap-3">
      {(["Yes", "No"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            value === opt
              ? "bg-brand-blue text-white border-brand-blue"
              : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
