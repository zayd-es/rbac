import React from 'react'

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-white mb-4">
        Team Access Control Demo
      </h1>

      <p className="text-slate-300 mb-8">
        This demo showcases Next.js 16 access control features with role-based permissions.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left Box: Features */}
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-lg">
          <h2 className="font-semibold text-white mb-4">
            Features Demonstrated
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>Role-based access control (RBAC)</li>
            <li>Route protection with middleware</li>
            <li>Server-side permission checks</li>
            <li>Client-side permission hooks</li>
            <li>Dynamic route access</li>
          </ul>
        </div>

        {/* Right Box: Roles */}
        <div className="bg-slate-900 p-6 border border-slate-800 rounded-lg">
          <h2 className="font-semibold text-white mb-4">
            Users Roles
          </h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="font-bold text-white">Super Admin:</span> Full system access</p>
            <p><span className="font-bold text-white">Admin:</span> User & team management</p>
            <p><span className="font-bold text-white">Manager:</span> Team specific management</p>
            <p><span className="font-bold text-white">User:</span> Basic dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage