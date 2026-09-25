const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(res.ok ? 'Invalid JSON from server' : `Request failed (${res.status})`);
  }

  if (!res.ok) {
    const err = data as { detail?: string | unknown };
    const detail =
      typeof err.detail === 'string'
        ? err.detail
        : err.detail != null
          ? JSON.stringify(err.detail)
          : `Request failed (${res.status})`;
    throw new Error(detail);
  }

  return data as T;
}

export { API_URL };
