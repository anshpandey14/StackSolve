import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verifyemail/${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-lg backdrop-blur-xl dark:bg-black/50">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
            <p className="mt-2 text-sm text-neutral-400">Please wait a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Email Verified!</h2>
            <p className="mt-2 text-sm text-neutral-300">{message}</p>
            <Link
              to="/login"
              className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-8 font-medium text-white shadow-sm hover:bg-orange-600 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="mt-2 text-sm text-red-400">{message}</p>
            <Link
              to="/register"
              className="mt-8 inline-flex h-10 items-center justify-center rounded-md border border-neutral-700 bg-transparent px-8 font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              Back to Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
