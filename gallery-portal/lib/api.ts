const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // cookies bhejna zaroori hai
    ...options,
  });
  return res;
}

// ── Auth ──
export const authAPI = {
  login: (username: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request("/api/auth/logout", { method: "DELETE" }),

  check: () => request("/api/auth/check"),
};

// ── Files ──
export const filesAPI = {
  getAll: () => request("/api/files"),

  getOne: (id: string) => request(`/api/files/${id}`),

  upload: (formData: FormData) =>
    request("/api/files", { method: "POST", body: formData }),

  incrementView: (id: string) =>
    request(`/api/files/view/${id}`, { method: "PATCH" }),

  toggleVisibility: (id: string, isPublic: boolean) =>
    request(`/api/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic }),
    }),

  delete: (id: string) =>
    request(`/api/files/${id}`, { method: "DELETE" }),
};

// ── Stats ──
export const statsAPI = {
  get: () => request("/api/stats"),
};