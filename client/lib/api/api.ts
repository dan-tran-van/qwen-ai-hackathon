"use client";
import createFetchClient, { Middleware } from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";
import { paths } from "./v1";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/";

export const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include", // Include cookies in requests
});

const AUTH_EXCLUDED_PATHS = new Set([
  "/api/accounts/token/refresh/",
  "/api/accounts/login/",
]);

console.log(Cookies.get("csrftoken") || Cookies.get("__Secure-csrftoken")); // Log the CSRF token for debugging

async function refreshToken() {
  try {
    const response = await fetch(`${API_BASE_URL}api/auth/token/refresh/`, {
      method: "POST",
      credentials: "include", // Include cookies in the refresh request
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access;
      Cookies.set("access", newAccessToken, {
        secure: true,
      });
      return newAccessToken;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = Cookies.get("access");
    const csrfToken =
      Cookies.get("csrftoken") || Cookies.get("__Secure-csrftoken"); // Try both common names for CSRF token

    if (csrfToken) {
      request.headers.set("X-CSRFToken", csrfToken);
    }

    if (!accessToken) return request;

    request.headers.set("Authorization", `Bearer ${accessToken}`);
    return request;
  },
  async onResponse({ response, request, schemaPath }) {
    if (AUTH_EXCLUDED_PATHS.has(schemaPath)) {
      return response;
    }
    const alreadyRetried = request.headers.get("x-retry") === "true";
    if (response.status === 401 && !alreadyRetried) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        const newHeaders = new Headers(request.headers);
        newHeaders.set("Authorization", `Bearer ${newAccessToken}`);
        newHeaders.set("x-retry", "true");

        return fetch(request.url, {
          ...request,
          headers: newHeaders,
        });
      } else {
        Cookies.remove("access");
        Cookies.remove("refresh");
        return response;
      }
    }
    return response;
  },
};

fetchClient.use(authMiddleware);

export const $api = createReactQueryClient(fetchClient);
