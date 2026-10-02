import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            MedChron AI
          </Link>
          <div className="flex items-center gap-6">
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
    className="text-sm text-gray-600 hover:text-blue-600"
  >
    Timeline
  </Link>
</div>
          

        </div>
      </header>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Heading */}
        <div>
          <p className="text-sm font-medium text-blue-600">
            Patient Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Patient Overview
          </h1>
        </div>

        {/* Patient Information */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                John Doe
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Patient ID: P001 · Age: 45 · Male
              </p>
            </div>
            <Link
  href="/patients"
  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
>
  View Patient
</Link>
            

          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Documents"
            value="5"
            description="Medical records"
          />

          <StatCard
            title="Events"
            value="12"
            description="Medical events"
          />

          <StatCard
            title="Lab Results"
            value="8"
            description="Recorded results"
          />

          <StatCard
            title="Medications"
            value="3"
            description="Current records"
          />

        </div>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Recent Activity */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Latest medical records and events
                </p>
              </div>

              <Link
                href="/timeline"
                className="text-sm font-semibold text-blue-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 divide-y divide-gray-100">

              <Activity
                icon="📄"
                title="Blood Report"
                date="12 Jun 2024"
              />

              <Activity
                icon="📄"
                title="Consultation Note"
                date="10 Jun 2024"
              />

              <Activity
                icon="💊"
                title="Medication Added"
                date="05 Jun 2024"
              />

            </div>
          </section>

          {/* Lab Trend */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Lab Trend
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Hemoglobin (Hb) over time
              </p>
            </div>

            {/* Simple Chart */}
            <div className="mt-8">

              <div className="flex h-48 items-end justify-between gap-6 border-b border-l border-gray-200 px-6">

                <div className="flex h-full flex-1 items-end justify-center">
                  <div className="w-10 rounded-t-lg bg-blue-400" style={{ height: "75%" }}>
                    <p className="-mt-7 text-center text-sm font-semibold text-gray-700">
                      13.2
                    </p>
                  </div>
                </div>

                <div className="flex h-full flex-1 items-end justify-center">
                  <div className="w-10 rounded-t-lg bg-blue-500" style={{ height: "60%" }}>
                    <p className="-mt-7 text-center text-sm font-semibold text-gray-700">
                      11.8
                    </p>
                  </div>
                </div>

                <div className="flex h-full flex-1 items-end justify-center">
                  <div className="w-10 rounded-t-lg bg-blue-600" style={{ height: "48%" }}>
                    <p className="-mt-7 text-center text-sm font-semibold text-gray-700">
                      9.9
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-3 flex justify-around text-sm text-gray-500">
                <span>Jan</span>
                <span>Mar</span>
                <span>Jun</span>
              </div>

            </div>

            {/* Alert */}
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">

              <p className="text-sm font-semibold text-amber-800">
                Change detected
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Hb decreased from 13.2 g/dL to 9.9 g/dL.
              </p>

            </div>

          </section>

        </div>

        {/* Alerts */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Alerts & Information
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <Alert
              title="Lab Change"
              text="A change was detected in the patient's Hb results."
            />

            <Alert
              title="Medication Update"
              text="A medication was recently added to the record."
            />

            <Alert
              title="Missing Information"
              text="Some medical information may require review."
            />

          </div>

        </section>

      </section>

    </main>
  );
}


/* Summary Card */
function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
}


/* Recent Activity */
function Activity({
  icon,
  title,
  date,
}: {
  icon: string;
  title: string;
  date: string;
}) {
  return (
    <div className="flex items-center justify-between py-4">

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {title}
          </p>

          <p className="text-xs text-gray-500">
            {date}
          </p>
        </div>

      </div>

      <button className="text-sm font-medium text-blue-600">
        View
      </button>

    </div>
    
  );
}


/* Alert */
function Alert({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

      <p className="font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {text}
      </p>

    </div>
  );
}