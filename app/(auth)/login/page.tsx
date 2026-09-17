"use client"
import React, { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/app/lib/apiClient'
import Link from 'next/link'

export type LoginState=
    |{success:true,error?:undefined}
    |{success:false,error?:string}


const LoginPage = () => {
    const router=useRouter()
   const [state, loginAction, isPending] = useActionState(
    async (
      prevState: LoginState,
      formdata: FormData
    ): Promise<LoginState> => {
      const email = formdata.get("email") as string;
      const password = formdata.get("password") as string;

      try {
        await apiClient.login(email, password); 
        router.push("/dashboard");
        return { success: true };
      } catch (error) {
                return {
                    success: false, 
                    error: error instanceof Error ? error.message : "Login failed"
                };
            }
    },
    { success: false, error: "" }
  );
 return (
    <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {state.error}
        </div>
      )}

      <form action={loginAction} className="space-y-5">
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
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center space-x-2"
        >
          {isPending ? <span>Signing in...</span> : <span>Sign In</span>}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage
