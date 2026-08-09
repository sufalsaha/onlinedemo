import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { authToken } from "../env";

export class UserSession<T> {
  private key = new TextEncoder().encode(authToken);
  private cookieName: string;

  constructor(cookieName: string) {
    this.cookieName = cookieName;
  }

  async setUser(user: T) {
    const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
    const session = await this.encrypt({ user });
    const cookieStore = await cookies();

    cookieStore.set(this.cookieName, session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  async getUser(): Promise<T | null> {
    const cookieStore = await cookies();

    const session = cookieStore.get(this.cookieName)?.value;
    if (!session) return null;
    const data = await this.decrypt(session);
    if (!data) return null;
    return data["user"] as T;
  }

  async removeUser() {
    const cookieStore = await cookies();

    cookieStore.set(this.cookieName, "", { expires: new Date(0) });
  }

  async updateUser(request: NextRequest) {
    const session = request.cookies.get(this.cookieName)?.value;
    if (!session) return;

    const parsed = await this.decrypt(session);
    if (!parsed) return;
    const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

    const res = NextResponse.next();
    res.cookies.set({
      name: this.cookieName,
      value: await this.encrypt(parsed),
      httpOnly: true,
      expires: expires,
    });
    return res;
  }

  private async encrypt(payload: JWTPayload) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7 days from now")
      .sign(this.key);
  }

  private async decrypt(input: string): Promise<JWTPayload | undefined> {
    try {
      const { payload } = await jwtVerify(input, this.key, {
        algorithms: ["HS256"],
      });
      return payload;
    } catch (error) {
      // A cookie that won't verify is routine — an expired token, a rotated
      // AUTH_SECRET, or a tampered value. The caller reads `undefined` as
      // "no session", which is the correct outcome, so don't log at error
      // level and trip the dev overlay over it.
      const code =
        error instanceof Error && "code" in error ? String(error.code) : "";

      if (code.startsWith("ERR_JW")) {
        console.warn(`Ignoring invalid ${this.cookieName} session cookie:`, code);
        return;
      }

      console.error(error);
    }
  }
}
