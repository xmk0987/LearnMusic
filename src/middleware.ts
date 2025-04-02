"use server";
import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session";

const protectedRoutes: string[] = [];
//const publicRoutes = ["/chapters"];
const nonAuthRoutes = ["/login", "/register"];

export default async function authMiddleware(req: NextRequest) {
  await updateSession(req);
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  //const isPublicRoute = publicRoutes.includes(path);
  const isNonAuthRoute = nonAuthRoutes.includes(path);

  const session = await getSession();

  if (isProtectedRoute && !session?.userId) {
    console.log("Trying to access a protected route without logging in");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session?.userId && isNonAuthRoute) {
    console.log("Redirecting authenticated user to /chapters");
    return NextResponse.redirect(new URL("/chapters", req.nextUrl));
  }

  return NextResponse.next();
}
