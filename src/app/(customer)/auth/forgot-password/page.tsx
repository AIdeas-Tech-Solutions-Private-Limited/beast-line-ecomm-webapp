"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, KeyRound, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/utils/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setSuccessPopup(true);
      toast.success("Password reset successful.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/30">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-black uppercase text-[#111111]">
              Password Reset
            </h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Redirecting to login
            </p>
          </div>
        </div>
      )}
      <div className="border border-black rounded-3xl p-8 bg-white text-black">

        <div className="text-center mb-8">
          <Link href="/" className="text-lg font-black tracking-widest uppercase text-[#111111]">
            ATHLETICA
          </Link>
          <h2 className="text-2xl font-black uppercase text-[#111111] mt-3">
            {step === 1 ? "Reset Password" : "Enter OTP"}
          </h2>
          <p className="text-[11px] text-zinc-400 font-semibold tracking-wide uppercase mt-1">
            {step === 1
              ? "We'll send you a one-time code"
              : `OTP sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-600 font-semibold text-xs mb-6">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4 text-xs">

            <div className="relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-black bg-white px-4 py-2.5 pl-10 text-xs font-semibold text-black placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3.5 text-zinc-400" size={14} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#111111] hover:bg-zinc-800 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4 text-xs">

            <div className="relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">One-Time Code</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full rounded-xl border border-black bg-white px-4 py-2.5 pl-10 text-xs font-semibold text-black placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none tracking-[6px] text-center"
                />
                <KeyRound className="absolute left-3.5 top-3.5 text-zinc-400" size={14} />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-black bg-white px-4 py-2.5 pl-10 text-xs font-semibold text-black placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none"
                />
                <Lock className="absolute left-3.5 top-3.5 text-zinc-400" size={14} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#111111] hover:bg-zinc-800 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Resetting..." : "Reset Password"}
              {!loading && <ArrowRight size={14} />}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(""); setOtp(""); setNewPassword(""); }}
              className="text-[10px] font-bold text-[#2563EB] hover:underline text-center mt-1"
            >
              Change email or resend OTP
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-zinc-400 font-semibold">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-[#2563EB] hover:underline font-bold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
