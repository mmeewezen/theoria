const BASE = "/api";

export async function apiFetch(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  library:     () => apiFetch("/library"),
  readingList: () => apiFetch("/reading-list"),
  notes:       () => apiFetch("/notes"),

  saveNote:    (key, text) => apiFetch(`/notes/${encodeURIComponent(key)}`, { method: "PUT", body: { text } }),

  addPhilosopher:    (data) => apiFetch("/philosophers", { method: "POST", body: data }),
  updatePhilosopher: (id, data) => apiFetch(`/philosophers/${id}`, { method: "PUT", body: data }),
  deletePhilosopher: (id) => apiFetch(`/philosophers/${id}`, { method: "DELETE" }),

  addWork:    (data) => apiFetch("/works", { method: "POST", body: data }),
  updateWork: (id, data) => apiFetch(`/works/${id}`, { method: "PUT", body: data }),
  deleteWork: (id) => apiFetch(`/works/${id}`, { method: "DELETE" }),

  addFragment:    (data) => apiFetch("/fragments", { method: "POST", body: data }),
  updateFragment: (id, data) => apiFetch(`/fragments/${id}`, { method: "PUT", body: data }),
  deleteFragment: (id) => apiFetch(`/fragments/${id}`, { method: "DELETE" }),

  export: () => apiFetch("/export"),
  import: (data) => apiFetch("/import", { method: "POST", body: data }),
};

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
