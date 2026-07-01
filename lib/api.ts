// API helper for dashboard
export async function callBackend(endpoint: string, payload: Record<string, unknown> = {}) {
  const res = await fetch("/api/backend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, ...payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function registerDoctor(data: {
  doctor_name: string;
  specialty: string;
  phone_number: string;
  password: string;
}) {
  return callBackend("api/register", data);
}

export async function login(phoneNumber: string, password: string) {
  return callBackend("api/login", { phone_number: phoneNumber, password });
}

export async function getStats(token: string) {
  return callBackend("api/stats", { token });
}

export async function getPatients(token: string) {
  return callBackend("api/patients", { token });
}

export async function getBookings(token: string) {
  return callBackend("api/bookings", { token });
}

export async function getProfile(token: string) {
  return callBackend("api/profile", { token });
}

export async function updateProfile(token: string, updates: Record<string, string>) {
  return callBackend("api/update-profile", { token, ...updates });
}

export async function sendCampaign(token: string, campaignContext: string) {
  return callBackend("api/send-campaign", { token, campaign_context: campaignContext });
}

export async function getWhatsAppQR(token: string) {
  return callBackend("api/whatsapp-qr", { token });
}

export async function getWhatsAppStatus(token: string) {
  return callBackend("api/whatsapp-status", { token });
}



