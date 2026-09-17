import { Role } from "@/app/generated/prisma";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser || !checkUserPermission(currentUser.role, Role.ADMIN)) {
      return NextResponse.json(
        { error: "You are not authorized to modify roles" },
        { status: 403 },
      );
    }

    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 },
      );
    }

    const { role } = await request.json();

    if (!role || !Object.values(Role).includes(role as Role)) {
      return NextResponse.json(
        { error: "Please provide a valid user role" },
        { status: 400 },
      );
    }

    if (role === Role.ADMIN) {
      return NextResponse.json(
        { error: "Promoting users to Admin is strictly disabled" },
        { status: 403 },
      );
    }

    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 },
      );
    }

    if (targetUser.role === Role.ADMIN) {
      return NextResponse.json(
        { error: "Primary Admin role cannot be modified" },
        { status: 403 },
      );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
      },
    });

    return NextResponse.json(
      { user: updatedUser, message: `User updated to ${role} successfully` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Role PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
