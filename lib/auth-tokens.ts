import * as SecureStore from "expo-secure-store";

const LEGACY_ACCESS_KEY = "token";
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

let accessTokenCache: string | null | undefined;
let refreshTokenCache: string | null | undefined;

export async function getAccessToken() {
  if (accessTokenCache !== undefined) return accessTokenCache;
  const token =
    (await SecureStore.getItemAsync(ACCESS_KEY)) ??
    (await SecureStore.getItemAsync(LEGACY_ACCESS_KEY));
  accessTokenCache = token;
  return token;
}

export async function getRefreshToken() {
  if (refreshTokenCache !== undefined) return refreshTokenCache;
  const token = await SecureStore.getItemAsync(REFRESH_KEY);
  refreshTokenCache = token;
  return token;
}

export async function setTokens(tokens: { access: string; refresh?: string | null }) {
  accessTokenCache = tokens.access;
  await SecureStore.setItemAsync(ACCESS_KEY, tokens.access);
  // Backward compat with existing code/key.
  await SecureStore.setItemAsync(LEGACY_ACCESS_KEY, tokens.access);

  if (tokens.refresh) {
    refreshTokenCache = tokens.refresh;
    await SecureStore.setItemAsync(REFRESH_KEY, tokens.refresh);
  }
}

export async function clearTokens() {
  accessTokenCache = null;
  refreshTokenCache = null;
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(LEGACY_ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

