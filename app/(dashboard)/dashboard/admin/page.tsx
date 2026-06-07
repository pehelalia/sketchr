'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/roles";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin(user)) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Admin Panel</h1>
        <Link href="/dashboard">
          <button style={{ background: "#666" }}>Back to Dashboard</button>
        </Link>
      </div>

      <div className="card" style={{ background: "#f0f7ff" }}>
        <h2>Admin Dashboard</h2>
        <p style={{ marginTop: "1rem", color: "#666" }}>
          Welcome to the admin panel. You have access to manage users and content.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <h3>Admin Functions</h3>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
            <li>Manage users and their roles</li>
            <li>Review and moderate content</li>
            <li>View analytics and reports</li>
            <li>System settings and configuration</li>
          </ul>
        </div>

        <div style={{ marginTop: "2rem", padding: "1rem", background: "white", borderRadius: "0.25rem" }}>
          <strong>Note:</strong> Implement additional admin features here as needed.
        </div>
      </div>
    </div>
  );
}
