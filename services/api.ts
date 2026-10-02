const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Common request function
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  return response.json();
}

// =========================
// AUTHENTICATION
// =========================

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================
// PATIENTS
// =========================

export async function getPatients() {
  return request("/api/patients");
}

export async function getPatient(patientId: string) {
  return request(`/api/patients/${patientId}`);
}

export async function createPatient(data: {
  name: string;
  age: number;
  gender: string;
}) {
  return request("/api/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================
// DOCUMENTS
// =========================

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Upload failed: ${response.status}`);
  }

  return response.json();
}

export async function getDocuments() {
  return request("/api/documents");
}

// =========================
// MEDICAL TIMELINE
// =========================

export async function getPatientTimeline(patientId: string) {
  return request(`/api/timeline/${patientId}`);
}