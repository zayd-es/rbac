import ManagerDashboard from "@/app/components/dashboard/ManagerDashboard";
import { Role } from "@/app/generated/prisma";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { transformUser, transformUsers } from "@/app/lib/utilis";
import { redirect } from "next/navigation";
import React from "react";

const ManagerPage = async () => {
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user.role, Role.MANAGER)) {
    redirect("/unauthorized");
  }

  const [prismaMyTeamMembers, prismaAllTeamMembers] = await Promise.all([
    user.teamId
      ? db.user.findMany({
          where: {
            teamId: user.teamId,
            role: { not: Role.ADMIN },
          },
          include: { team: true },
        })
      : [],
    db.user.findMany({
      where: { role: { not: Role.ADMIN } },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
          },
        },
      },
      orderBy: { teamId: "desc" },
    }),
  ]);

  return (
    <ManagerDashboard
      myTeamMembers={transformUsers(prismaMyTeamMembers)}
      allTeamMembers={transformUsers(prismaAllTeamMembers)}
      currentUser={transformUser(user)}
    />
  );
};

export default ManagerPage;
