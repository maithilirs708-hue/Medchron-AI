"use client";

import Link from "next/link";

const timelineEvents = [
  {
    date: "12 Jun 2024",
    type: "Lab Result",
    title: "Blood Test",
    details: "Hemoglobin (Hb): 9.9 g/dL",
    color: "bg-blue-600",
  },
  {
    date: "10 Mar 2024",
    type: "Medication",
    title: "Medication Added",
    details: "Iron supplement added to treatment",
    color: "bg-green-600",
  },
  {
    date: "15 Feb 2024",
    type: "Lab Result",
    title: "Blood Test",
    details: "Hemoglobin (Hb): 11.8 g/dL",
    color: "bg-blue-600",
  },
  {
    date: "05 Jan 2024",
    type: "Consultation",
    title: "Follow-up Consultation",
    details: "Patient reported fatigue and weakness",
    color: "bg-gray-500",
  },
  {
    date: "05 Jan 2024",
    type: "Medication",
    title: "Prescription Updated",
    details: "Previous medication dosage changed",
    color: "bg-green-600",
  },
];

export default function TimelinePage() {
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
              className="text-sm text-gray-600 hover:text-blue-600"
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
              className="text-sm font-semibold text-blue-600"
            >
              Timeline
            </Link>
          </nav>

        </div>
      </header>

      {/* Page */}
      <section className="mx-auto max-w-5xl px-6 py-10">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold text-blue-600">
            MEDICAL HISTORY
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Medical Timeline
          </h1>

          <p className="mt-2 text-gray-600">
            View the patient&apos;s medical history in chronological order.
          </p>
        </div>

        {/* Patient Summary */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-gray-500">
                Patient
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                John Doe
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Patient ID: P001 • 45 years • Male
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium text-blue-600">
                RECORDS
              </p>

              <p className="mt-1 text-xl font-bold text-blue-900">
                5 Events
              </p>
            </div>

          </div>

        </div>

        {/* Timeline */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Patient History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Medical events organized by date
            </p>
          </div>

          <div className="relative">

            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 h-[calc(100%-20px)] w-px bg-gray-200" />

            <div className="space-y-8">

              {timelineEvents.map((event, index) => (
                <div
                  key={`${event.date}-${event.title}-${index}`}
                  className="relative flex gap-5"
                >

                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 mt-1 h-10 w-10 shrink-0 rounded-full ${event.color} flex items-center justify-center border-4 border-white shadow-sm`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-5">

                    <div className="flex flex-col justify-between gap-2 sm:flex-row">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {event.type}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                          {event.details}
                        </p>
                      </div>

                      <span className="text-sm font-medium text-gray-500">
                        {event.date}
                      </span>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* Lab Trend */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            Lab Trend
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Example of how MedChron AI can identify changes over time.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                January
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                13.2 g/dL
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Hemoglobin
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                March
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                11.8 g/dL
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Hemoglobin
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-5">
              <p className="text-sm text-red-600">
                June
              </p>

              <p className="mt-2 text-2xl font-bold text-red-700">
                9.9 g/dL
              </p>

              <p className="mt-1 text-xs text-red-600">
                Hemoglobin • Change detected
              </p>
            </div>

          </div>

        </div>

        {/* AI Summary */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h2 className="text-lg font-bold text-blue-900">
            AI-Assisted History Summary
          </h2>

          <p className="mt-3 text-sm leading-6 text-blue-800">
            The patient&apos;s hemoglobin values show a decrease from
            13.2 g/dL in January to 9.9 g/dL in June. A medication was
            added during the same period. This summary is generated from
            the available medical records and should be reviewed against
            the original documents.
          </p>

        </div>

      </section>

    </main>
  );
}