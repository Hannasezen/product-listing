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
