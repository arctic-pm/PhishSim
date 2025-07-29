import { NavLink } from "react-router-dom";
import {
  LucideBarChart2,
  LucideBookOpen,
  LucideFiles,
  LucideMail
} from "lucide-react";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const navItem = (
    path: string,
    label: string,
    icon: ReactNode
  ) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 ${
          isActive ? "bg-gray-200" : "text-gray-700"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r bg-white p-4">
        <h1 className="mb-6 text-xl font-bold">PhishSim</h1>
        <nav className="space-y-1">
          {navItem("/dashboard", "Dashboard", <LucideBarChart2 size={18} />)}
          {navItem("/campaigns", "Campaigns", <LucideMail size={18} />)}
          {navItem("/templates", "Templates", <LucideFiles size={18} />)}
          {navItem("/analytics", "Analytics", <LucideBarChart2 size={18} />)}
          {navItem("/education", "Education", <LucideBookOpen size={18} />)}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
