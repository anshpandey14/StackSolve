import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/auth";
import { Link } from "react-router-dom";

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);

export default function Register() {
  const { createAccount } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      setError("Please fill out all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await createAccount(
      name.toString(),
      email.toString(),
      password.toString(),
    );
    if (res.success) {
      setSuccessMsg(
        res.message ||
          "Account created! Please check your email to verify your account.",
      );
    } else {
      setError(res.error || "Registration failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="pt-40 pb-20 px-4">
      <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/10 bg-white/5 p-4 shadow-input dark:bg-black/50 backdrop-blur-xl md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Create an Account
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>{" "}
          here.
        </p>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        {successMsg ? (
          <div className="my-8 rounded-lg bg-green-500/10 p-6 text-center border border-green-500/20">
            <h3 className="text-xl font-semibold text-green-500 mb-2">
              Check your email
            </h3>
            <p className="text-sm text-neutral-300 mb-6">{successMsg}</p>
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-800 px-4 font-medium text-white shadow-sm hover:bg-neutral-700"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" type="text" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                placeholder="developer@example.com"
                type="email"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account →"}
              <BottomGradient />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
