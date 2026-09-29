"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function DocumentsPage() {
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PDF, JPG, or PNG file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10 MB.");
      return;
    }

    setFileName(file.name);
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!fileName) {
      alert("Please select a medical document first.");
      return;
    }

    // Temporary frontend simulation.
    // Later this will call the backend upload API.
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);
  };

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
              className="text-sm font-semibold text-blue-600"
            >
              Documents
            </Link>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-6 py-10">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold text-blue-600">
            DOCUMENT MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Upload Medical Document
          </h1>

          <p className="mt-2 text-gray-600">
            Upload medical records for AI-powered information extraction
            and timeline generation.
          </p>
        </div>

        {/* Upload Card */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <label
            htmlFor="medical-document"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-14 text-center hover:border-blue-500 hover:bg-blue-50"
          >

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600">
              ↑
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              {fileName
                ? "Document selected"
                : "Drag & drop your medical document"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {fileName
                ? fileName
                : "or click here to browse files"}
            </p>

            <p className="mt-4 text-xs text-gray-400">
              Supported: PDF, JPG, PNG • Maximum size: 10 MB
            </p>

            <input
              id="medical-document"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>

          {/* Selected File */}
          {fileName && (
            <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Selected document
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {fileName}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Ready
              </span>

            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Upload Document
          </button>

          {/* Progress */}
          {uploadProgress > 0 && (
            <div className="mt-7">

              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Upload Progress
                </span>

                <span className="text-gray-500">
                  {uploadProgress}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {uploadProgress === 100 && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Document uploaded successfully.
                </p>
              )}

            </div>
          )}

        </div>

        {/* Processing Flow */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h2 className="text-lg font-semibold text-blue-900">
            What happens after upload?
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-4">

            <div className="rounded-lg bg-white p-4">
              <p className="font-semibold text-gray-900">
                1. Upload
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Medical document is uploaded.
              </p>
            </div>

            <div className="rounded-lg bg-white p-4">
              <p className="font-semibold text-gray-900">
                2. Extract
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Text is extracted from the document.
              </p>
            </div>

            <div className="rounded-lg bg-white p-4">
              <p className="font-semibold text-gray-900">
                3. Analyze
              </p>
              <p className="mt-1 text-sm text-gray-500">
                AI identifies medical information.
              </p>
            </div>

            <div className="rounded-lg bg-white p-4">
              <p className="font-semibold text-gray-900">
                4. Timeline
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Information is organized chronologically.
              </p>
            </div>

          </div>

        </div>

        {/* Recent Documents */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              Recent Documents
            </h2>
          </div>

          <div className="divide-y divide-gray-100">

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="font-medium text-gray-900">
                  Blood_Report.pdf
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Sample document • 12 Jun 2024
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Processed
              </span>
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="font-medium text-gray-900">
                  Prescription.pdf
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Sample document • 10 Jun 2024
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Processing
              </span>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}