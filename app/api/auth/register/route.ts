import { Role } from "@/app/generated/prisma";
import {  generatetoken, hashPassword } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
teamCode: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, teamCode } = validation.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email address exists" },
        { status: 409 }
      );
    }

    let teamId: string | null=null;

    if (typeof teamCode === "string" && teamCode.trim() !== "") {
      const team = await db.team.findUnique({
        where: { code: teamCode },
      });

      if (!team) {
        return NextResponse.json(
          { error: "Please enter a valid team code" },
          { status: 400 }
        );
      }

       teamId = team.id;
    }

    const hashedPassword = await hashPassword(password);
    const userCount = await db.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        teamId,
      },
      include: { team: true },
    });

    const token = generatetoken(user.id);

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,  
          name: user.name,
          role: user.role,
          teamId: user.teamId,
          team: user.team,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      path:"/"
    });

    return response;
  } catch (error) {
    console.error("Registration Failed:", error);
    return NextResponse.json(
      { error: "Internal server error, something went wrong" },
      { status: 500 }
    );
  }
}