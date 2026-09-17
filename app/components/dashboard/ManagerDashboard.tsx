"use client";

import { User } from "@/app/generated/prisma";
import { Users, UserCheck, UserMinus, Shield } from "lucide-react";

export type ManagerDashboardProps = {
  myTeamMembers: User[];
  allTeamMembers: User[];
  currentUser: User;
};

export default function ManagerDashboard({
  myTeamMembers,
  allTeamMembers,
  currentUser,
}: ManagerDashboardProps) {
  return (
    <div className="space-y-8 p-6 text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Manager Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Manage your team members and oversee organizational staff.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              My Team Size
            </span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold mt-2 text-white">
            {myTeamMembers.length}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Organization Users
            </span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold mt-2 text-white">
            {allTeamMembers.length}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Role
            </span>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl font-semibold mt-2 text-amber-300">
            {currentUser.role}
          </div>
        </div>
      </div>

      {/* My Team Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">My Team Members</h2>
          <p className="text-sm text-slate-400">
            People currently assigned to your team.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="pb-3 px-2">Name</th>
                <th className="pb-3 px-2">Email</th>
                <th className="pb-3 px-2">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {myTeamMembers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500">
                    No members in your team yet.
                  </td>
                </tr>
              ) : (
                myTeamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="py-3 px-2 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      {member.name || "Unnamed"}
                    </td>
                    <td className="py-3 px-2 text-slate-400">{member.email}</td>
                    <td className="py-3 px-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {member.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Organization Members Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">
            All Organization Staff
          </h2>
          <p className="text-sm text-slate-400">
            Read-only directory of all users in the system.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="pb-3 px-2">Name</th>
                <th className="pb-3 px-2">Email</th>
                <th className="pb-3 px-2">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allTeamMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-800/30 transition"
                >
                  <td className="py-3 px-2 font-medium text-white">
                    {member.name || "Unnamed"}
                  </td>
                  <td className="py-3 px-2 text-slate-400">{member.email}</td>
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {member.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
