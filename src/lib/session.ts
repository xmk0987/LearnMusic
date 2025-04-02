import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SESSION_SECRET as string;

if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    console.log("Failed to verify session");
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return NextResponse.next();

  const parsed = await decrypt(session);
  if (!parsed || !parsed.user) return NextResponse.next();

  const now = Date.now();
  const expiresAt = new Date(parsed.expiresAt as string);

  if (expiresAt.getTime() - now > 10 * 60 * 1000) return NextResponse.next();

  const newExpiresAt = new Date(now + 30 * 60 * 1000);
  const updatedSession = await encrypt({
    userId: parsed.userId as string,
    expiresAt: newExpiresAt,
  });

  const response = NextResponse.next();
  response.cookies.set("session", updatedSession, {
    httpOnly: true,
    secure: true,
    expires: newExpiresAt,
  });

  return response;
}
