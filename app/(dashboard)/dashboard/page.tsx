'use client';

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getUserRole, isAdmin } from "@/lib/roles";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const userRole = getUserRole(user);
  const isAdminUser = isAdmin(user);

  return (
    <div>
      <h1>Welcome, {user.firstName || "Artist"}!</h1>

      <div style={{ marginTop: "2rem", display: "grid", gap: "2rem" }}>
        <div className="card">
          <h2>Your Profile</h2>
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <strong>Role:</strong> {userRole}
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <strong>Member Since:</strong>{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="card">
          <h2>Available Sections</h2>
          <div className="links" style={{ marginTop: "1rem" }}>
            <Link href="/dashboard/gallery">Gallery</Link>
            <Link href="/dashboard/upload">Upload Sketch</Link>
            {isAdminUser && <Link href="/dashboard/admin">Admin Panel</Link>}
          </div>
        </div>

        {isAdminUser && (
          <div className="card" style={{ background: "#f0f7ff" }}>
            <h2>🔒 Admin Access</h2>
            <p style={{ marginTop: "1rem", color: "#666" }}>
              You have admin privileges. You can access the admin panel to
              manage users and content.
            </p>
            <Link href="/dashboard/admin">
              <button style={{ marginTop: "1rem" }}>Go to Admin Panel</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
