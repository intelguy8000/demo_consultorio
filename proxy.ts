import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware simplificado: siempre estamos autenticados como Dra. Catalina
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirigir de /login al dashboard (ya no necesitamos login)
  if (pathname === "/login" || pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
