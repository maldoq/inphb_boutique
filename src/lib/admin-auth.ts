import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "inphb_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 16) {
    throw new Error("ADMIN_PASSWORD doit contenir au moins 16 caractères.");
  }
  return password;
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET doit contenir au moins 32 caractères.");
  }
  return secret;
}

function signature(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

export function isAdminPasswordValid(candidate: string) {
  const expectedHash = createHmac("sha256", "inphb-admin-password-check")
    .update(getAdminPassword())
    .digest();
  const candidateHash = createHmac("sha256", "inphb-admin-password-check")
    .update(candidate)
    .digest();
  return timingSafeEqual(candidateHash, expectedHash);
}

export async function createAdminSession() {
  const issuedAt = Date.now();
  const payload = `${issuedAt}.${randomBytes(16).toString("hex")}`;
  const token = `${payload}.${signature(payload)}`;
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [issuedAtValue, nonce, providedSignature, extra] = token.split(".");
  if (!issuedAtValue || !nonce || !providedSignature || extra) return false;
  if (!/^\d+$/.test(issuedAtValue) || !/^[a-f0-9]{32}$/.test(nonce)) return false;
  if (!/^[a-f0-9]{64}$/.test(providedSignature)) return false;

  const issuedAt = Number(issuedAtValue);
  const now = Date.now();
  if (issuedAt > now + 60_000 || now - issuedAt > SESSION_DURATION_SECONDS * 1000) return false;

  const expectedSignature = signature(`${issuedAtValue}.${nonce}`);
  return timingSafeEqual(
    Buffer.from(providedSignature, "hex"),
    Buffer.from(expectedSignature, "hex"),
  );
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Accès administrateur requis.");
  }
}
