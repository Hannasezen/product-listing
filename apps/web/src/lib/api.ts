const DEFAULT_API_URL = 'http://localhost:3001';

export function getApiBaseUrl() {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');
}

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchJsonWithToken<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function postJsonWithToken(
  path: string,
  token: string,
  body: unknown,
): Promise<Response> {
  return fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function deleteWithToken(path: string, token: string): Promise<Response> {
  return fetch(`${getApiBaseUrl()}${path}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });
}
