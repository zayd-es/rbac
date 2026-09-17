import UserDashboard from "@/app/components/dashboard/UserDashboard";
import { Role } from "@/app/generated/prisma";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const UserPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const teamMembers = user.teamId
    ? await db.team.findMany({
        where: { id: user.teamId },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      })
    : null;

  return <UserDashboard currentUser={user} myTeam={teamMembers} />;
};

export default UserPage;
