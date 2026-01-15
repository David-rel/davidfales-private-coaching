import crypto from "crypto";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(payloadB64: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");
}

export function generateSessionToken(): string {
  const secret = process.env.SECURITY_CODE;
  if (!secret) {
    return "";
  }

  const now = Date.now();
  const payload = JSON.stringify({
    iat: now,
    exp: now + ONE_DAY_MS,
    nonce: crypto.randomBytes(16).toString("hex"),
  });

  const payloadB64 = base64UrlEncode(payload);
  const signature = signPayload(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.SECURITY_CODE;
  if (!secret) return false;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return false;

  const expected = signPayload(payloadB64, secret);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function invalidateSession(): void {
  // No-op for stateless sessions; cookie removal handled elsewhere if needed.
}

export function verifyPassword(password: string): boolean {
  return password === process.env.SECURITY_CODE;
}
