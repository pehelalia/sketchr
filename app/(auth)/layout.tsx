export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Sketchr</h1>
        {children}
      </div>
    </div>
  );
}
