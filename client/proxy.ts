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
  const refresh = (await cookies()).get("refresh")?.value;
  console.log("Access token:", access);
  console.log("Refresh token:", refresh);

  if (!access && refresh) {
    console.log(
      "No access token, but refresh token exists. Attempting to refresh...",
    );
    try {
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        },
      );
      const responesJson = await refreshResponse.json();
      if (refreshResponse.ok) {
        const newAccess = responesJson.access;
        console.log("New access token:", newAccess);
        (await cookies()).set("access", newAccess, {
          secure: true,
        });
      } else {
        (await cookies()).delete("access");
        // (await cookies()).delete("refresh");
        console.log(refresh);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      (await cookies()).delete("access");
      // (await cookies()).delete("refresh");
      console.log(refresh);
    }
  }
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
      // try {
      //   const refreshResponse = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_BASE_URL}api/auth/token/refresh/`,
      //     {
      //       method: "POST",
      //       credentials: "include",
      //     },
      //   );
      //   if (refreshResponse.ok) {
      //     const newAccess = (await refreshResponse.json()).access;
      //     console.log("New access token:", newAccess);
      //     (await cookies()).set(
      //       "access",
      //       (await refreshResponse.json()).access,
      //       {
      //         secure: true,
      //       },
      //     );
      //     return true;
      //   }
      // } catch (error) {
      //   console.error("Failed to refresh token:", error);
      // }
      return false;
    });

  console.log("Is logged in:", isLoggedIn);

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
