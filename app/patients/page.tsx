
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: string;
};

const initialPatients: Patient[] = [
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
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  // Load saved patients when the page opens
  useEffect(() => {
    const savedPatients = localStorage.getItem("medchron-patients");

    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch {
        setPatients(initialPatients);
      }
    }
  }, []);

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Add a new patient
  const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter the patient's name.");
      return;
    }

    if (!age.trim()) {
      alert("Please enter the patient's age.");
      return;
    }

    const newPatient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      name: name.trim(),
      age: Number(age),
      gender: gender,
      lastVisit: "Today",
      status: "Active",
    };

    const updatedPatients = [...patients, newPatient];

    setPatients(updatedPatients);

    // Save to browser storage
    localStorage.setItem(
      "medchron-patients",
      JSON.stringify(updatedPatients)
    );

    // Clear form
    setName("");
    setAge("");
    setGender("Male");

    // Close form
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* =========================
          NAVIGATION
      ========================== */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            MedChron AI
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">

            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>

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
              href="/documents"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Documents
            </Link>

            <Link
              href="/timeline"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Timeline
            </Link>

          </nav>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}
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

        {/* =========================
            SEARCH + ADD BUTTON
        ========================== */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Search */}
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:max-w-md"
          />

          {/* Add Patient */}
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add Patient
          </button>

        </div>

        {/* =========================
            ADD PATIENT FORM
        ========================== */}
        {showForm && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* Form Header */}
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-gray-900">
                Add New Patient
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-lg text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleAddPatient}
              className="mt-5 grid gap-4 sm:grid-cols-3"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="patient-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Patient Name
                </label>

                <input
                  id="patient-name"
                  type="text"
                  placeholder="Enter patient name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="patient-age"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Age
                </label>

                <input
                  id="patient-age"
                  type="number"
                  min="0"
                  max="150"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="patient-gender"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>

                <select
                  id="patient-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="sm:col-span-3">

                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Save Patient
                </button>

              </div>

            </form>
          </div>
        )}

        {/* =========================
            PATIENT TABLE
        ========================== */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              {/* Table Header */}
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

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">

                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50"
                  >

                    {/* ID */}
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      {patient.id}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {patient.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Medical record
                      </p>
                    </td>

                    {/* Age */}
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {patient.age}
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {patient.gender}
                    </td>

                    {/* Last Visit */}
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {patient.lastVisit}
                    </td>

                    {/* Status */}
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

                    {/* Action */}
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

          {/* No Search Results */}
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

        {/* =========================
            INFORMATION
        ========================== */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-900">
            Medical record management
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-800">
            Patient information is currently stored in the browser for
            frontend demonstration. It will later be connected to the
            MedChron AI backend and PostgreSQL database.
          </p>

        </div>

      </section>

    </main>
  );
}