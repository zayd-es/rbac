import { NextResponse } from "next/server";

export async function POST(){
    try {
        const response=NextResponse.json({
            message:"Logged out seccessfully"},
            {status:200} )

            response.cookies.set("token","",{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"lax",
                path:"/",
                maxAge:0
            })
            return response

    } catch (error) {
        console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    )
    }

}