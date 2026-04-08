"use client";
import createFetchClient, { Middleware } from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";
import { paths } from "./v1";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/";

const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
});

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = Cookies.get("access");
    if (!accessToken) return request;

    request.headers.set("Authorization", `Bearer ${accessToken}`);
    return request;
  },
};

fetchClient.use(authMiddleware);

export const $api = createReactQueryClient(fetchClient);
