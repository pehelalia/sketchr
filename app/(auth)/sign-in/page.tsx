import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="card">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none",
            headerTitle: "text-center",
            headerSubtitle: "text-center text-gray-600",
            socialButtonsBlockButton:
              "w-full py-2 px-4 mb-2 border border-gray-300 rounded-md hover:bg-gray-50",
            formButtonPrimary:
              "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md",
            formFieldInput:
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            dividerLine: "bg-gray-300",
            dividerText: "text-gray-500",
            footerActionLink: "text-blue-600 hover:text-blue-700",
            footerActionText: "text-gray-600",
          },
        }}
      />
    </div>
  );
}
