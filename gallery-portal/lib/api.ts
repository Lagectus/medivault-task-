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
  login: async (username: string, password: string) => {
    const res = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // agar 200 nahi hai, error throw karo
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }

    return res;
  },

  logout: async () => {
    const res = await request("/api/auth/logout", { method: "DELETE" });
    if (!res.ok) throw new Error("Logout failed");
    return res;
  },

  check: async () => {
    const res = await request("/api/auth/check");
    if (!res.ok) throw new Error("Not authenticated");
    return res;
  },
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