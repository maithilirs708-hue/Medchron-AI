import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Brain,
  Clock3,
  FileSearch,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
              AI-Powered Medical History
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900">
              Your Medical History,
              <br />
              Organized with AI
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Upload your medical records, get structured information,
              track changes over time, and understand your medical
              history through an organized timeline.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Get Started
              </Link>

              <Link
                href="#features"
                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Patient Overview
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    John Doe
                  </h2>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  P001
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Documents</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    5
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Events</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    12
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Labs</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    8
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Medicines</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    3
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900">
                  Medical Timeline
                </p>

                <div className="mt-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Lab Result
                      </p>
                      <p className="text-xs text-gray-500">
                        Hb: 9.9 g/dL · Jun 12, 2024
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Medication Added
                      </p>
                      <p className="text-xs text-gray-500">
                        Medicine · Mar 10, 2024
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Consultation
                      </p>
                      <p className="text-xs text-gray-500">
                        Follow-up visit · Jan 05, 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Key Features */}
      <section
        id="features"
        className="border-t border-gray-100 bg-gray-50 py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Key Features
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Everything in one place
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              MedChron AI organizes medical records and turns them
              into structured, easy-to-understand information.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Feature 1 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                Upload Documents
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Upload PDF, JPG, and PNG medical records.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                AI Extraction
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Extract important medical information from records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <Clock3 className="h-5 w-5 text-blue-600" />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                Medical Timeline
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                View medical events in chronological order.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <FileSearch className="h-5 w-5 text-blue-600" />
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                Smart Summary
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Get an organized summary with evidence from records.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
          © 2026 MedChron AI. Medical information organization
          and clinical decision-support prototype.
        </div>
      </footer>
    </main>
  );
}