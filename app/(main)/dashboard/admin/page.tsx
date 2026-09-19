import AdminDashboard from "@/app/components/dashboard/AdminDashboard";
import { Role } from "@/app/generated/prisma";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { getPaginatedUsers } from "@/app/lib/services/userService";
import { transformTeams } from "@/app/lib/utilis";
import { redirect } from "next/navigation";
import React from "react";

interface AdminPageProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}

const AdminPage = async ({ searchParams }: AdminPageProps) => {
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user.role, Role.ADMIN)) {
    redirect("/unauthorized");
  }

  const resolvedSearchParams = await searchParams;

  // ✅ زدنا استخراج stats هنا
  const [{ data: users, meta, stats }, prismaTeams] = await Promise.all([
    getPaginatedUsers(resolvedSearchParams),
    db.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  const teams = transformTeams(prismaTeams);

  return (
    <AdminDashboard
      users={users}
      teams={teams}
      currentUser={user}
      meta={meta}
      stats={stats} // ✅ دوزنا stats كـ Prop هنا
    />
  );
};

export default AdminPage;
