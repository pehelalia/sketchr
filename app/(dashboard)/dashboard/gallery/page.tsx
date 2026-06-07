'use client';

import Link from "next/link";

export default function GalleryPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Gallery</h1>
        <Link href="/dashboard">
          <button style={{ background: "#666" }}>Back to Dashboard</button>
        </Link>
      </div>

      <div className="card">
        <p>Your gallery will appear here. Upload your first sketch to get started!</p>
        <Link href="/dashboard/upload">
          <button style={{ marginTop: "1rem" }}>Upload Your First Sketch</button>
        </Link>
      </div>
    </div>
  );
}
