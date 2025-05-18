import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Only run middleware on routes that access Supabase auth or protected data
    "/login",
    "/auth/:path*",
    "/private",
    "/api/chat/:path*",
  ],
};
