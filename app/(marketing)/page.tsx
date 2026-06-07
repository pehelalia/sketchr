import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { PenTool, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-stone-900">
            Sketchlog
          </Link>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-stone-900 hover:text-stone-700 transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-stone-900 hover:text-stone-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6">
          Document Your Artistic Journey
        </h1>
        <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
          Track your progress, build consistency, and celebrate your growth as an artist.
          Sketchlog is your private space to reflect and improve.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 border border-stone-200 text-stone-900 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-y border-stone-200 py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-stone-900 mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-stone-100 rounded-lg">
                  <PenTool size={32} className="text-stone-900" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Create Entries
              </h3>
              <p className="text-stone-600">
                Document your sketches, process, and creative reflections.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-stone-100 rounded-lg">
                  <TrendingUp size={32} className="text-stone-900" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Track Progress
              </h3>
              <p className="text-stone-600">
                Build streaks, set goals, and visualize your artistic growth.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-stone-100 rounded-lg">
                  <Users size={32} className="text-stone-900" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Discover Others
              </h3>
              <p className="text-stone-600">
                Find inspiration from other artists on their creative journeys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">
          Ready to track your growth?
        </h2>
        <p className="text-lg text-stone-600 mb-8">
          Join artists who are documenting their creative journey.
        </p>
        <SignedOut>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
          >
            Get Started Free
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
          >
            Go to Dashboard
          </Link>
        </SignedIn>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center text-stone-600">
          <p>&copy; 2024 Sketchlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
