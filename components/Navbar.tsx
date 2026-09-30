import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MedChron AI
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600"
          >
            Home
          </Link>

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
            href="/login"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
  href="/register"
  className="rounded-lg border border-blue-600 px-5 py-2.5 font-semibold text-blue-600 hover:bg-blue-50"
>
  Register
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
    </nav>
  );
}