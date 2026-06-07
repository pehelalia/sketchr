'use client';

import Link from "next/link";

export default function UploadPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Upload functionality coming soon!");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Upload Sketch</h1>
        <Link href="/dashboard">
          <button style={{ background: "#666" }}>Back to Dashboard</button>
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="title" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Sketch Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter sketch title"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "0.25rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="description" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your sketch"
              rows={4}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "0.25rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label htmlFor="file" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Upload File
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "0.25rem",
              }}
            />
          </div>

          <button type="submit">Upload Sketch</button>
        </form>
      </div>
    </div>
  );
}
