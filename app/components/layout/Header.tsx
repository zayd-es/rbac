"use client"

import { User } from "@/app/types"
import Link from "next/link"
import { usePathname } from "next/navigation"



interface HeaderProps{
    user:User|null
}
const Header = ({user}:HeaderProps) => {
  const pathname=usePathname()

  const navgation=[
    {name:"Home",href:"/",show:true},
    {name:"Dashbaord",href:"/dashboard",show:true}
  ].filter((item)=>item.show)

  const getNavItemClass=(href:string)=>{
    let isActive=false 
    if(href==="/"){
      isActive=pathname==="/"
    }else if(href==="/dashboard"){
      isActive=pathname.startsWith(href)
    }
  return `px-3 py-2 rounded text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

}
const user1=false

  return (
   <header className="bg-slate-900 border-b border-slate-700">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center  h-16">
        {/* LOGO */}
        <Link href="/" className=" font-bold text-xl text-white">Team Access</Link>
        {/* NAVIGATION */}
        <nav className="flex items-center space-x-6">
          {navgation.map((item)=>(
            <Link key={item.name} href={item.href} className={getNavItemClass(item.href)}> {item.name}</Link>
          ))}
        </nav>
        <div>
        {/* User Info Section */}
<div className="flex items-center space-x-4">
  {user ? (
    <>
      <span className="text-sm text-slate-300">{user.name}</span>
      <button
        onClick={() => {}}
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
      >
        Register
      </Link>
    </>
  )}
</div>
        </div>
      </div>
    </div>
   </header>
  )
}

export default Header
