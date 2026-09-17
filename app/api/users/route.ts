import { Prisma, Role } from "@/app/generated/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You are not authorized to access user informations" },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const role = searchParams.get("role");
    const teamId = searchParams.get("teamId");

    const WHERE: Prisma.UserWhereInput = {};

    if (user.role === Role.ADMIN) {
    } else if (user.role === Role.MANAGER) {
      WHERE.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      WHERE.teamId = user.teamId;
      WHERE.role = {
        not: Role.ADMIN,
      };
    }

    if (teamId) {
      if (user.role === Role.USER && teamId !== user.teamId) {
        return NextResponse.json(
          { error: "You cannot access another team" },
          { status: 403 },
        );
      }

      WHERE.teamId = teamId;
    }

    if (role) {
      if (user.role === Role.USER && role === Role.ADMIN) {
        return NextResponse.json(
          { error: "You cannot access ADMIN users" },
          { status: 403 },
        );
      }

      WHERE.role = role as Role;
    }

    const users = await db.user.findMany({
      where: WHERE,

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
