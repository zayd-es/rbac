import AdminDashboard from '@/app/components/dashboard/AdminDashboard'
import { Role } from '@/app/generated/prisma'
import { checkUserPermission, getCurrentUser } from '@/app/lib/auth'
import db from '@/app/lib/db'
import { transformTeams, transformUsers } from '@/app/lib/utilis'
import { redirect } from 'next/navigation'
import React from 'react'

const AdminPage = async () => {
  const user = await getCurrentUser()

  if (!user || !checkUserPermission(user.role, Role.ADMIN)) {
    redirect("/unauthorized")
  }

  const [prismaUsers, prismaTeams] = await Promise.all([
    db.user.findMany({
      include: {
        team: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
      },
    }),
  ])
  const users=transformUsers(prismaUsers)
  const teams=transformTeams(prismaTeams)

  return (
    <AdminDashboard
      users={users}
      teams={teams}
      currentUser={user}
    />
  )
}

export default AdminPage