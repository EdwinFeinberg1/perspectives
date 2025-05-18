import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protected routes that require authentication
  const authRoutes = ["/chat-auth", "/prayer-auth"];
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Non-auth routes that should redirect to auth versions when user is authenticated
  const nonAuthRoutes = ["/chat", "/prayer"];
  const isNonAuthRoute = nonAuthRoutes.some((route) => path.startsWith(route));

  // If user is authenticated
  if (user) {
    // Only redirect if we're on a non-auth route
    if (isNonAuthRoute && !path.includes("-auth")) {
      const newPath = path.replace(/^\/chat|^\/prayer/, "$&-auth");
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // If user is not authenticated
  if (!user) {
    // Block access to auth routes and redirect to non-auth version
    if (isAuthRoute) {
      const newPath = path.replace(/-auth/g, "");
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}
