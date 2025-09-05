const BASE_URL = "https://backend.writive.de";

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

export function setAccessToken(token) {
  localStorage.setItem("token", token);
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();

    // backend returns access_token and refresh_token
    if (data.access_token) {
      setAccessToken(data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      return data.access_token;
    }

    return null;
  } catch (err) {
    console.error("Token refresh error:", err);
    return null;
  }
}
