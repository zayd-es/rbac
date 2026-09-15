import { Role } from "@/app/generated/prisma";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user.role, Role.ADMIN)) {
      return NextResponse.json(
        { error: "You are not authorized to assign team" },
        { status: 403 }
      );
    }

    const { teamId } = await request.json();

    if (!teamId) {
      return NextResponse.json(
        { error: "Please enter a valid team code" },
        { status: 400 }
      );
    }

    const teamExists = await db.team.findUnique({
      where: { id: teamId },
    });

    if (!teamExists) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { teamId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            teamId: true,
            team:true
        },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
  console.error("Team assignment error:", error);

  if (error instanceof Error) {
    return NextResponse.json(
      { error: "User not found" }, 
      { status: 404 }
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}
}