"use client";

import { apiClient } from "@/app/lib/apiClient";
import { PaginationMeta, Role, Team, User } from "@/app/types";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Building2,
  UserMinus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "./PaginationControls";

// ✅ زدنا Type لـ DashboardStats
export type DashboardStats = {
  totalUsers: number;
  totalTeams: number;
  adminsCount: number;
  managersCount: number;
  unassignedCount: number;
};

export type AdminDashboardProps = {
  users: User[];
  teams: Team[];
  currentUser: User;
  meta: PaginationMeta;
  stats: DashboardStats; // ✅ زدنا الـ stats هنا
};

const AdminDashboard = ({
  users,
  teams,
  currentUser,
  meta,
  stats: dashboardStats, // ✅ استقبلنا الـ stats
}: AdminDashboardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTeamAssignment = async (
    userId: string,
    teamId: string | null,
  ) => {
    startTransition(async () => {
      try {
        await apiClient.assignUserToTeam(userId, teamId);
        router.refresh();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Error updating team assignment",
        );
      }
    });
  };

  const handleRoleAssignment = async (userId: string, newRole: Role) => {
    const targetUser = users.find((u) => u.id === userId);

    if (targetUser?.role === Role.ADMIN) {
      return alert("Primary Admin role cannot be modified!");
    }

    startTransition(async () => {
      try {
        await apiClient.updateUserRole(userId, newRole);
        router.refresh();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Error updating role");
      }
    });
  };

  // ✅ كنعمروا الـ Cards من dashboardStats الجاية من الـ DB مباشرة بدال u.filter()
  const statsList = [
    {
      label: "Total Users",
      count: dashboardStats.totalUsers,
      icon: Users,
      color: "text-slate-200",
    },
    {
      label: "Total Teams",
      count: dashboardStats.totalTeams,
      icon: Building2,
      color: "text-indigo-400",
    },
    {
      label: "Admins",
      count: dashboardStats.adminsCount,
      icon: ShieldCheck,
      color: "text-rose-400",
    },
    {
      label: "Managers",
      count: dashboardStats.managersCount,
      icon: UserCheck,
      color: "text-sky-400",
    },
    {
      label: "Unassigned",
      count: dashboardStats.unassignedCount,
      icon: UserX,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage user roles, team assignments, and system permissions.
          </p>
        </div>
      </div>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {statsList.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-900/60"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${item.color}`}>
                    {item.count}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40 hidden sm:block">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2. Users Table */}
        <Card className="lg:col-span-7 bg-slate-900/40 border-slate-800/80 backdrop-blur-md shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-slate-800/80 bg-slate-950/40 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-100 flex items-center justify-between">
                <span>Users</span>
                <Badge
                  variant="secondary"
                  className="bg-slate-800/80 text-slate-200 border-slate-700/80 font-mono text-xs px-2.5 py-0.5 rounded-full"
                >
                  {meta.totalCount}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Manage roles and team assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-950/60 border-b border-slate-800/80">
                    <TableRow className="hover:bg-transparent border-slate-800/80">
                      <TableHead className="text-slate-400 font-medium text-xs">
                        User
                      </TableHead>
                      <TableHead className="text-slate-400 font-medium text-xs">
                        Role
                      </TableHead>
                      <TableHead className="text-slate-400 font-medium text-xs">
                        Team
                      </TableHead>
                      <TableHead className="text-slate-400 font-medium text-xs text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors"
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-slate-700/60">
                              <AvatarFallback className="bg-slate-800 text-indigo-400 text-xs font-semibold">
                                {user.name?.charAt(0).toUpperCase() ||
                                  user.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 max-w-[140px] sm:max-w-[180px]">
                              <div className="font-medium text-slate-200 text-sm truncate">
                                {user.name || "—"}
                              </div>
                              <div className="text-slate-500 text-xs truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-3">
                          <Select
                            value={user.role}
                            onValueChange={(val) =>
                              handleRoleAssignment(user.id, val as Role)
                            }
                            disabled={isPending || user.role === Role.ADMIN}
                          >
                            <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-950/60 border-slate-800/80 text-slate-200 hover:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50 transition-colors">
                              <SelectValue placeholder={user.role}>
                                {user.role}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                              {Object.values(Role)
                                .filter(
                                  (role) =>
                                    role !== Role.ADMIN ||
                                    user.role === Role.ADMIN,
                                )
                                .map((role) => (
                                  <SelectItem
                                    key={role}
                                    value={role}
                                    className="text-xs hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer"
                                  >
                                    {role}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="py-3">
                          <Select
                            value={user.teamId || "none"}
                            onValueChange={(val) =>
                              handleTeamAssignment(
                                user.id,
                                val === "none" ? null : val,
                              )
                            }
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-950/60 border-slate-800/80 text-slate-200 hover:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50 transition-colors">
                              <SelectValue
                                placeholder={
                                  teams.find((t) => t.id === user.teamId)
                                    ?.name || "No Team"
                                }
                              >
                                {teams.find((t) => t.id === user.teamId)
                                  ?.name || "No Team"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                              <SelectItem
                                value="none"
                                className="text-xs hover:bg-slate-800 text-slate-400 focus:bg-slate-800 focus:text-slate-200 cursor-pointer"
                              >
                                No Team
                              </SelectItem>
                              {teams.map((team) => (
                                <SelectItem
                                  key={team.id}
                                  value={team.id}
                                  className="text-xs hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer"
                                >
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="py-3 text-right">
                          {user.teamId && user.role !== Role.ADMIN ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleTeamAssignment(user.id, null)
                              }
                              disabled={isPending}
                              className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs transition-colors"
                            >
                              <UserMinus className="w-3.5 h-3.5 mr-1" />
                              Remove
                            </Button>
                          ) : (
                            <span className="text-slate-600 text-xs">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </div>

          <div className="p-4 border-t border-slate-800/80">
            <PaginationControls meta={meta} />
          </div>
        </Card>

        {/* 3. Teams Table */}
        <Card className="lg:col-span-5 bg-slate-900/40 border-slate-800/80 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-800/80 bg-slate-950/40 px-6 py-4">
            <CardTitle className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Teams</span>
              <Badge
                variant="secondary"
                className="bg-slate-800/80 text-slate-200 border-slate-700/80 font-mono text-xs px-2.5 py-0.5 rounded-full"
              >
                {teams.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Overview of team codes and assigned managers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/60 border-b border-slate-800/80">
                  <TableRow className="hover:bg-transparent border-slate-800/80">
                    <TableHead className="text-slate-400 font-medium text-xs">
                      Team
                    </TableHead>
                    <TableHead className="text-slate-400 font-medium text-xs">
                      Code
                    </TableHead>
                    <TableHead className="text-slate-400 font-medium text-xs">
                      Members
                    </TableHead>
                    <TableHead className="text-slate-400 font-medium text-xs">
                      Managers
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => {
                    // 💡 ملاحظة: إذا كنت محتاج أعداد الأعضاء والـ Managers ديال الـ Teams يرجعوا حقيقيين ومايتأثروش بالـ Pagination،
                    // الأفضل تجمع هاد المعطيات مع الـ query ديال teams فـ الـ Backend (مثلا Prisma include _count)
                    const teamMembers = users.filter(
                      (u) => u.teamId === team.id,
                    );
                    const teamManagers = teamMembers.filter(
                      (u) => u.role === Role.MANAGER,
                    );

                    return (
                      <TableRow
                        key={team.id}
                        className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors"
                      >
                        <TableCell className="py-3 font-medium text-slate-200 text-sm">
                          {team.name}
                        </TableCell>

                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] bg-slate-950/60 text-indigo-300 border-indigo-500/30 uppercase tracking-wide px-2 py-0.5"
                          >
                            {team.code}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-3 text-slate-400 text-xs">
                          {teamMembers.length} users
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {teamManagers.length > 0 ? (
                              teamManagers.map((m) => (
                                <Badge
                                  key={m.id}
                                  variant="secondary"
                                  className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 font-normal px-2 py-0.5"
                                >
                                  {m.name || m.email.split("@")[0]}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-slate-600 text-xs italic">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
