import React from "react";
import { ShieldCheck, Users, ChevronRight } from "lucide-react";

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
          Team Access Control Demo
        </h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          This demo showcases Next.js 16 access control features with role-based
          permissions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Features Demonstrated
            </h2>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-400">
            {[
              "Role-based access control (RBAC)",
              "Route protection with middleware",
              "Server-side permission checks",
              "Client-side permission hooks",
              "Dynamic route access",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">User Roles</h2>
          </div>
          <div className="space-y-3 text-xs">
            {[
              {
                role: "Admin",
                desc: "User & team management",
                badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
              },
              {
                role: "Manager",
                desc: "Team specific management",
                badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
              },
              {
                role: "User",
                desc: "Basic dashboard",
                badge: "bg-slate-800 text-slate-300 border-slate-700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-slate-800/50 pb-2 last:border-0 last:pb-0"
              >
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${item.badge}`}
                >
                  {item.role}
                </span>
                <span className="text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
