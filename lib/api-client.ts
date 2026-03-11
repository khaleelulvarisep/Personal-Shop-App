import { API_BASE_URL } from "@/constants/api";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/auth-tokens";

// Backend refresh endpoint (provided by you).
const REFRESH_PATH = "/api/auth/token/refresh/";

let refreshInFlight: Promise<string | null> | null = null;

function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!pathOrUrl.startsWith("/")) return `${API_BASE_URL}/${pathOrUrl}`;
  return `${API_BASE_URL}${pathOrUrl}`;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refresh = await getRefreshToken();
    if (!refresh) return null;

    try {
      const res = await fetch(`${API_BASE_URL}${REFRESH_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data: unknown = await res.json().catch(() => null);
        if (data && typeof data === "object") {
          const access =
            "access" in data && typeof (data as { access?: unknown }).access === "string"
              ? (data as { access: string }).access
              : null;
          const nextRefresh =
            "refresh" in data && typeof (data as { refresh?: unknown }).refresh === "string"
              ? (data as { refresh: string }).refresh
              : null;

          if (access) {
            await setTokens({ access, refresh: nextRefresh ?? refresh });
            return access;
          }
        }
      }
    } catch {
      // fall through
    }

    // Refresh failed; tokens are now invalid.
    await clearTokens();
    return null;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function authFetch(pathOrUrl: string, init: RequestInit = {}) {
  const url = toAbsoluteUrl(pathOrUrl);

  const headers = new Headers(init.headers);
  const token = await getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });
  if (res.status !== 401) return res;

  const nextToken = await refreshAccessToken();
  if (!nextToken) return res;

  headers.set("Authorization", `Bearer ${nextToken}`);
  return fetch(url, { ...init, headers });
}
