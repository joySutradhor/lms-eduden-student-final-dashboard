"use client";
import DashboardHome from "@/components/dashboardHome/page";
import { useToken } from "@/components/hooks/GetToken";

export default function Home() {
  const [token, userId, isLoading] = useToken();

  // Show loading while verifying token
  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </section>
    );
  }

  
  return (
    <section>
      <DashboardHome />
    </section>
  );
}
