import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <AdminSidebar userName={session.user.name ?? "Admin"} />
      <div className="flex-1 overflow-x-hidden p-6 sm:p-10">{children}</div>
    </div>
  );
}
