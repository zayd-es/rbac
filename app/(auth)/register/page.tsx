"use client"
import { apiClient } from '@/app/lib/apiClient';
import React, { useActionState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export type RegisterState = 
  | { success: true; error?: undefined }
  | { success: false; error: string };
const RegisterPage = () => {
    const router=useRouter()
  const [state, registerAction, isPending] = useActionState(
        async (prevState: RegisterState, formdata: FormData): Promise<RegisterState> => {
            const name = formdata.get("name") as string;
            const email = formdata.get("email") as string;
            const password = formdata.get("password") as string;
            const teamCode = formdata.get("teamCode") as string;

            try {
                await apiClient.register({ name, email, password, teamCode });
                router.push("/dashboard");
                return { success: true };
            } catch (error) {
                return {
                    success: false, 
                    error: error instanceof Error ? error.message : "Registration failed"
                };
            }
        },
        { success: false, error: "" } 
    );
   return (
  <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold text-white tracking-tight">
        Create Account
      </h2>
      <p className="text-slate-400 text-sm mt-2">
        Enter your details below to register
      </p>
    </div>

    {state.error && (
      <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
        {state.error}
      </div>
    )}

    <form action={registerAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          autoComplete="name"
          required
          placeholder="John Doe"
          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="name@company.com"
          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Team Code (Optional)
        </label>
        <input
          type="text"
          name="teamCode"
          autoComplete="off"
          placeholder="Enter team code if yout have one"
          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center space-x-2"
      >
        {isPending ? (
          <span>Creating account...</span>
        ) : (
          <span>Register</span>
        )}
      </button>
    </form>

    <p className="text-center text-sm text-slate-400 mt-6">
      Already have an account?{" "}
      <Link
        href="/login"
        className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
      >
        Sign in
      </Link>
    </p>
  </div>
);
}

export default RegisterPage
