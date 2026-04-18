import { NextRequest, NextResponse } from "next/server";

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

const publicRoutes = ["/login", "/signup", "/auth/google/callback"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  let access = req.cookies.get("access")?.value;
  const refresh = req.cookies.get("refresh")?.value;

  const response = NextResponse.next();

  if (!access && refresh) {
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
          cache: "no-store",
        },
      );

      if (refreshResponse.ok) {
        const refreshJson: { access: string } = await refreshResponse.json();
        access = refreshJson.access;

        response.cookies.set("access", access, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });
      } else {
        response.cookies.delete("access");
      }
    } catch {
      response.cookies.delete("access");
    }
  }

  let isLoggedIn = false;

  if (access) {
    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/user/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access}`,
          },
          cache: "no-store",
        },
      );

      isLoggedIn = userResponse.ok;
    } catch {
      isLoggedIn = false;
    }
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && isLoggedIn && path !== "/overview") {
    return NextResponse.redirect(new URL("/overview", req.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
