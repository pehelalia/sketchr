import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <div className="header">
        <h1>Sketchr</h1>
        <div className="nav">
          <SignedOut>
            <Link href="/sign-in">Sign In</Link>
            <Link href="/sign-up">Sign Up</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>Welcome to Sketchr</h2>
        <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#666" }}>
          Your creative platform for artists and designers
        </p>

        <SignedOut>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/sign-up">
              <button style={{ marginRight: "1rem" }}>Get Started</button>
            </Link>
            <Link href="/sign-in">
              <button style={{ background: "#666" }}>Sign In</button>
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/dashboard">
              <button>Go to Dashboard</button>
            </Link>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
