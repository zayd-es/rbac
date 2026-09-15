"use client"
import React, { createContext, useActionState, useState } from "react";
import { AuthContextType, User } from "../types";

type LoginState={
    success?:boolean,
    user?:User|null,
    error?:string

}

const AuthContext=createContext <AuthContextType| undefined>(undefined);

export const AuthProvider=({children}:{children:React.ReactNode})=>{
    const [user,setUser]=useState<User|null>(null)
    const [loginState,loginAction,isLoginPending]=useActionState(callback function,{
        
    })
    return(
        <AuthContext.Provider value={{user,login,logout,hasPermission}}>
             {children}    
      </AuthContext.Provider>
    )

}