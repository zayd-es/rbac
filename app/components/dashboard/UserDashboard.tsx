"use client";

import { Role } from "@/app/generated/prisma";
import { Users, Shield, Mail, UserCheck } from "lucide-react";

type TeamMember = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
};

type TeamData = {
  id: string;
  name?: string;
  code?: string;
  members: TeamMember[];
};

type UserDashboardProps = {
  currentUser: {
    id: string;
    name?: string | null;
    email: string;
    role: Role;
    teamId?: string | null;
  };
  myTeam: TeamData[] | null;
};

export default function UserDashboard({
  currentUser,
  myTeam,
}: UserDashboardProps) {
  const activeTeam = myTeam && myTeam.length > 0 ? myTeam[0] : null;
  const teamMembers = activeTeam?.members || [];

  return (
    <div className="space-y-8 p-6 text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          User Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome back, {currentUser.name || currentUser.email}. Here is your
          profile and team overview.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Role
            </span>
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold mt-2 text-indigo-300">
            {currentUser.role}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Assigned Team
            </span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold mt-2 text-white">
            {activeTeam?.name || "No Team Assigned"}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Team Teammates
            </span>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold mt-2 text-white">
            {teamMembers.length}
          </div>
        </div>
      </div>

      {/* My Team Members Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">My Teammates</h2>
          <p className="text-sm text-slate-400">
            Colleagues working with you in{" "}
            {activeTeam?.name || "your current team"}.
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
              {teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500">
                    You are not assigned to any team yet.
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-800/30 transition"
                  >
                    <td className="py-3 px-2 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs">
                        {member.name
                          ? member.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      {member.name || "Unnamed"}
                    </td>
                    <td className="py-3 px-2 text-slate-400">
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {member.email}
                      </span>
                    </td>
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
    </div>
  );
}
