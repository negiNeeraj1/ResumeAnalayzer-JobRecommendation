"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { key: "student", label: "Student" },
  { key: "recruiter", label: "Recruiter" },
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // student
    headline: "", // e.g., Frontend Intern | React | Tailwind
    topSkills: "", // comma separated
    experienceYears: "",
    // recruiter
    company: "",
    position: "",
    hiringFocus: "", // roles/skills
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isStudent = role === "student";

  const disabled = useMemo(() => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) return true;
    if (form.password !== form.confirmPassword) return true;
    if (isStudent) {
      return !form.headline || !form.topSkills;
    }
    return !form.company || !form.position;
  }, [form, isStudent]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    
    setError("");
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role,
      };

      // Add role-specific fields
      if (role === "student") {
        userData.headline = form.headline;
        userData.topSkills = form.topSkills;
        userData.experienceYears = form.experienceYears ? parseFloat(form.experienceYears) : 0;
      } else {
        userData.company = form.company;
        userData.position = form.position;
        userData.hiringFocus = form.hiringFocus;
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/recruiter');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-2xl rounded-2xl shadow-2xl backdrop-blur-md p-6 sm:p-8 relative overflow-hidden"
          style={{ backgroundColor: "#DEDED1" }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: "#B6AE9F" }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
            style={{ backgroundColor: "#8B7D6B" }}
          />

          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold text-center" style={{ color: "#8B7D6B" }}>
              Create your account
            </h1>
            <p className="mt-2 text-center" style={{ color: "#6B5B47" }}>
              Choose your role to personalize your experience
            </p>

            {/* Role selection */}
            <div className="mt-6 grid grid-cols-2 gap-2 bg-white/50 p-1 rounded-xl">
              {ROLES.map((r) => {
                const active = r.key === role;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      active ? "shadow-lg scale-[1.02]" : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: active ? "#B6AE9F" : "transparent",
                      color: active ? "#FBF3D1" : "#6B5B47",
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "#f8d7da", color: "#721c24" }}>
                {error}
              </div>
            )}

            {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
              <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "#fff3cd", color: "#856404" }}>
                Passwords do not match
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Full name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={update("name")}
                    className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                    style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                    style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={update("password")}
                    className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                    style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Confirm password</label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                    className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                    style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                  />
                </div>
              </div>

              {/* CONDITIONAL FIELDS */}
              {isStudent ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Headline</label>
                    <input
                      type="text"
                      placeholder="e.g., Frontend Intern | React | Tailwind"
                      value={form.headline}
                      onChange={update("headline")}
                      className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                      style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Top skills</label>
                    <input
                      type="text"
                      placeholder="React, Node, SQL"
                      value={form.topSkills}
                      onChange={update("topSkills")}
                      className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                      style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Years of experience</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.experienceYears}
                      onChange={update("experienceYears")}
                      className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                      style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={update("company")}
                      className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                      style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Position</label>
                    <input
                      type="text"
                      value={form.position}
                      onChange={update("position")}
                      className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                      style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>Hiring focus</label>
                    <input
                      type="text"
                      placeholder="e.g., Backend, AI/ML, Data, Mobile"
                      value={form.hiringFocus}
                      onChange={update("hiringFocus")}
                      className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                      style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || disabled}
                className="w-full rounded-lg py-2 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-70"
                style={{ backgroundColor: "#B6AE9F", color: "#FBF3D1" }}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm" style={{ color: "#6B5B47" }}>
              Already have an account? {" "}
              <Link href="/login" className="font-semibold underline-offset-4 hover:underline" style={{ color: "#8B7D6B" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


