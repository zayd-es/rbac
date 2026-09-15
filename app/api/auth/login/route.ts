import {  generatetoken, verifyPassword } from "@/app/lib/auth";
import db from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
email: z.string().email("Invalid email address"),
password: z.string().min(1, "Password is required"),});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {  email, password} = validation.data;

    const userFromDb = await db.user.findUnique({
      where: { email },
      include:{team:true}
    });

    if (!userFromDb) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const isPasswordValid=await verifyPassword(password,userFromDb.password)
    if(!isPasswordValid){
        return NextResponse.json(
            {error:"Invalid email or password"},
            {status:401}
        )
    }
    const token=generatetoken(userFromDb.id)

    const response = NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: userFromDb.id,
          email: userFromDb.email,  
          name: userFromDb.name,
          role: userFromDb.role,
          teamId: userFromDb.teamId,
          team: userFromDb.team,
        },
      },
      { status: 200 }
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
    console.error("Login Failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}