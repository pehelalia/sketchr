'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getUserRole } from "@/lib/roles";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const userRole = getUserRole(user);

  return (
    <div>
      <div className="header">
        <div>
          <h1>
            <Link href="/" style={{ color: "#0070f3", textDecoration: "none" }}>
              Sketchr Dashboard
            </Link>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.25rem" }}>
            Role: <strong>{userRole}</strong>
          </p>
        </div>
        <div className="nav">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <main className="container">{children}</main>
    </div>
  );
}
