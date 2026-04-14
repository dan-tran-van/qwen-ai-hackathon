import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = [
  "/",
  "/overview",
  "/incoming-records",
  "/ai-assistant",
  "/smart-search",
  "/library",
  "/analytics",
  "/security",
];
const publicRoutes = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the access token from cookies
  const access = (await cookies()).get("access")?.value;
  const isLoggedIn = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/user/`,
    {
      headers: {
        Authorization: `Bearer ${access}`,
      },
      credentials: "include",
    },
  )
    .then((res) => res.ok)
    .catch(async () => {
      try {
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/token/refresh/`,
          {
            method: "POST",
            credentials: "include",
          },
        );
        if (refreshResponse.ok) {
          (await cookies()).set(
            "access",
            (await refreshResponse.json()).access,
            {
              secure: true,
            },
          );
          return true;
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
      return false;
    });

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    isLoggedIn &&
    !req.nextUrl.pathname.startsWith("/overview")
  ) {
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
