"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Plus, Trash2, Save, X } from "lucide-react";

interface CaseFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<{ success: boolean; message: string }>;
  isEditing?: boolean;
}

export default function CaseForm({ initialData, onSubmit, isEditing = false }: CaseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 1500);
  const [category, setCategory] = useState(initialData?.category || "General");
  
  // Patient Data
  const patientData = initialData?.patientData || {};
  const [patientName, setPatientName] = useState(patientData.name || "");
  const [patientAge, setPatientAge] = useState<number>(patientData.age || 30);
  const [patientGender, setPatientGender] = useState(patientData.gender || "Male");
  const [patientHPI, setPatientHPI] = useState(patientData.history?.hpi || "");
  const [patientPMH, setPatientPMH] = useState<string[]>(patientData.history?.pmh || []);
  const [newPMH, setNewPMH] = useState("");
  
  // Scenario
  const scenario = initialData?.scenario || {};
  const [doctorName, setDoctorName] = useState(scenario.doctorName || "Dr. House");
  const [prompt, setPrompt] = useState(scenario.prompt || "");

  // Quiz
  const quiz = initialData?.quiz || {};
  const [options, setOptions] = useState<{ id: string; label: string; text: string; isCorrect: boolean }[]>(
    quiz.options || [
      { id: "A", label: "A", text: "", isCorrect: false },
      { id: "B", label: "B", text: "", isCorrect: false },
      { id: "C", label: "C", text: "", isCorrect: false },
      { id: "D", label: "D", text: "", isCorrect: false },
    ]
  );
  const [feedbackSuccess, setFeedbackSuccess] = useState(quiz.feedback?.success?.message || "");
  const [feedbackFail, setFeedbackFail] = useState(quiz.feedback?.fail?.message || "");

  // Vitals State
  const vitals = patientData.vitals || {};
  const [hr, setHr] = useState<number>(vitals.hr || 80);
  const [bp, setBp] = useState(vitals.bp || "120/80");
  const [temp, setTemp] = useState<number>(vitals.temp || 37);
  const [rr, setRr] = useState<number>(vitals.rr || 16);
  const [o2, setO2] = useState<number>(vitals.o2 || 98);

  // Allergies State
  const [allergies, setAllergies] = useState<string[]>(patientData.history?.allergies || []);
  const [newAllergy, setNewAllergy] = useState("");

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddPMH = () => {
    if (newPMH.trim()) {
      setPatientPMH([...patientPMH, newPMH.trim()]);
      setNewPMH("");
    }
  };

  const handleRemovePMH = (index: number) => {
    setPatientPMH(patientPMH.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    // Ensure only one correct answer for now
    if (field === "isCorrect" && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false;
      });
    }
    
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Basic Validation
    if (!options.some(opt => opt.isCorrect)) {
      setError("Please select at least one correct answer for the quiz.");
      setIsSubmitting(false);
      return;
    }

    const caseData = {
      title,
      description,
      difficulty,
      category,
      patientData: {
        name: patientName,
        age: patientAge,
        gender: patientGender,
        history: {
          hpi: patientHPI,
          pmh: patientPMH,
          allergies: allergies,
          meds: [], // Simplified for now
        },
        vitals: { hr, bp, temp, rr, o2 },
        progress: { current: 1, total: 3 }
      },
      scenario: {
        doctorName,
        doctorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=House", // Default
        prompt
      },
      quiz: {
        options,
        feedback: {
          success: { title: "Correct!", message: feedbackSuccess || "Great job!" },
          fail: { title: "Incorrect", message: feedbackFail || "Try again." }
        }
      }
    };

    try {
      const result = await onSubmit(caseData);
      if (!result.success) {
        setError(result.message || "Failed to save case");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="space-y-4 p-6 bg-card border border-border rounded-xl">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
              Case Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="e.g. The Dizzy Patient"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  <option value="General">General</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Suggested Difficulty (ELO)
                {!isEditing && <span className="text-xs text-muted-foreground ml-2 font-normal">(Admins will finalize this)</span>}
              </label>
              <input 
                type="number" 
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background min-h-[80px]"
                placeholder="Brief summary of the case..."
                required
              />
            </div>
          </section>

          {/* Patient Data */}
          <section className="space-y-4 p-6 bg-card border border-border rounded-xl">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              Patient Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name (Fictional)</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <input 
                  type="number" 
                  value={patientAge}
                  onChange={(e) => setPatientAge(parseInt(e.target.value))}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <select 
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">HR (bpm)</label>
                <input 
                  type="number" 
                  value={hr}
                  onChange={(e) => setHr(parseInt(e.target.value))}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">BP (mmHg)</label>
                <input 
                  type="text" 
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="120/80"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Temp (°C)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">RR (/min)</label>
                <input 
                  type="number" 
                  value={rr}
                  onChange={(e) => setRr(parseInt(e.target.value))}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">O2 Sat (%)</label>
                <input 
                  type="number" 
                  value={o2}
                  onChange={(e) => setO2(parseInt(e.target.value))}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">History of Present Illness (HPI)</label>
              <textarea 
                value={patientHPI}
                onChange={(e) => setPatientHPI(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background min-h-[100px]"
                placeholder="Patient presents with..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Past Medical History</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPMH}
                  onChange={(e) => setNewPMH(e.target.value)}
                  className="flex-1 p-2 rounded-md border border-input bg-background"
                  placeholder="Add condition..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPMH())}
                />
                <button 
                  type="button" 
                  onClick={handleAddPMH}
                  className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {patientPMH.map((pmh, idx) => (
                  <span key={idx} className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    {pmh}
                    <button type="button" onClick={() => handleRemovePMH(idx)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Allergies</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="flex-1 p-2 rounded-md border border-input bg-background"
                  placeholder="Add allergy..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                />
                <button 
                  type="button" 
                  onClick={handleAddAllergy}
                  className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {allergies.map((allergy, idx) => (
                  <span key={idx} className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    {allergy}
                    <button type="button" onClick={() => handleRemoveAllergy(idx)} className="text-red-500 hover:text-red-700">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Scenario & Quiz */}
          <section className="space-y-4 p-6 bg-card border border-border rounded-xl">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
              Scenario & Quiz
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Doctor's Prompt (The Question)</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background min-h-[80px]"
                placeholder="What is the most likely diagnosis?"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Options</label>
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex gap-3 items-start">
                  <div className="pt-2">
                    <input 
                      type="radio" 
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => handleOptionChange(idx, "isCorrect", true)}
                      className="w-4 h-4 text-primary"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder={`Option ${opt.label}`}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Success Feedback</label>
                <input 
                  type="text" 
                  value={feedbackSuccess}
                  onChange={(e) => setFeedbackSuccess(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="Correct! This is because..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Failure Feedback</label>
                <input 
                  type="text" 
                  value={feedbackFail}
                  onChange={(e) => setFeedbackFail(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="Incorrect. Consider..."
                  required
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? "Update Case" : "Appeal Case"}
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
}
