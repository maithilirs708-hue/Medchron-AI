"use client";

import Link from "next/link";

export default function AppNavbar() {
  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          MedChron AI
        </Link>

        {/* Application Navigation */}
        <div className="flex items-center gap-5">

          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/patients"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Patients
          </Link>

          <Link
            href="/documents"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Documents
          </Link>

          <Link
            href="/timeline"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Timeline
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Back to Home
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </Link>

        </div>
      </div>
    </nav>
  );
}