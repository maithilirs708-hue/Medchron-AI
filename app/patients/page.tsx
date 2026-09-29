"use client";

import Link from "next/link";
import { useState } from "react";

const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    lastVisit: "12 Jun 2024",
    status: "Active",
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 38,
    gender: "Female",
    lastVisit: "08 Jun 2024",
    status: "Active",
  },
  {
    id: "P003",
    name: "Alex Kumar",
    age: 52,
    gender: "Male",
    lastVisit: "02 Jun 2024",
    status: "Review",
  },
  {
    id: "P004",
    name: "Sarah Wilson",
    age: 31,
    gender: "Female",
    lastVisit: "28 May 2024",
    status: "Active",
  },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            MedChron AI
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/patients"
              className="text-sm font-semibold text-blue-600"
            >
              Patients
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Logout
            </Link>
          </nav>

        </div>
      </header>

      {/* Page Content */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold text-blue-600">
            PATIENT MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Patients
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage patient medical records.
          </p>
        </div>

        {/* Search + Add */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            + Add Patient
          </button>

        </div>

        {/* Patient Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Patient ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Age
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Last Visit
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      {patient.id}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {patient.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Medical record
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {patient.age}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {patient.gender}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {patient.lastVisit}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          patient.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href="/dashboard"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Empty Search Result */}
          {filteredPatients.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-gray-900">
                No patients found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try searching with another name or patient ID.
              </p>
            </div>
          )}

        </div>

        {/* Information */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-900">
            Medical record management
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-800">
            Patient information shown here is currently sample data.
            It will later be connected to the MedChron AI backend and
            PostgreSQL database.
          </p>

        </div>

      </section>

    </main>
  );
}