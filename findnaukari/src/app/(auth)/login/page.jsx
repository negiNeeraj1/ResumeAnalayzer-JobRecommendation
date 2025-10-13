"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { key: "student", label: "Student" },
  { key: "recruiter", label: "Recruiter" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
          className="w-full max-w-md rounded-2xl shadow-2xl backdrop-blur-md p-6 sm:p-8 relative overflow-hidden"
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
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-center"
              style={{ color: "#8B7D6B" }}
            >
              Welcome back
            </h1>
            <p className="mt-2 text-center" style={{ color: "#6B5B47" }}>
              Sign in to your account
            </p>

            {/* Role Switcher */}
            <div className="mt-6 grid grid-cols-2 gap-2 bg-white/50 p-1 rounded-xl">
              {ROLES.map((r) => {
                const active = r.key === role;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      active
                        ? "shadow-lg scale-[1.02]"
                        : "opacity-80 hover:opacity-100"
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                  style={{
                    borderColor: "#C5C7BC",
                    color: "#6B5B47",
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" style={{ color: "#6B5B47" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2 outline-none transition focus:ring-2"
                  style={{ borderColor: "#C5C7BC", color: "#6B5B47" }}
                />
              </div>

              {/* Role contextual hint */}
              <div className="text-xs" style={{ color: "#8B7D6B" }}>
                {role === "student"
                  ? "Sign in to explore personalized job matches and resume insights."
                  : "Sign in to post roles and discover talent quickly."}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg py-2 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-70"
                style={{ backgroundColor: "#B6AE9F", color: "#FBF3D1" }}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm" style={{ color: "#6B5B47" }}>
              New here? {" "}
              <Link
                href="/signup"
                className="font-semibold underline-offset-4 hover:underline"
                style={{ color: "#8B7D6B" }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


