// middleware.ts (root mein, proxy.ts DELETE karo)
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = req.cookies.get("mv_admin_session")?.value;

    // ✅ Cookie nahi hai toh through karo — 
    // client-side (admin/page.tsx ka useEffect) localStorage check karega
    // aur wahan se /admin/login pe redirect karega
    if (!cookie) {
      // Block mat karo, client handle karega
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};