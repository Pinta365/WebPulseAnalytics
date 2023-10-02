import { decode as base64UrlDecode, encode as base64UrlEncode } from "$std/encoding/base64url.ts";

// Encodes a string to Uint8Array using TextEncoder.
function textEncode(data: string): Uint8Array {
  return new TextEncoder().encode(data);
}

// Decodes a Uint8Array to string using TextDecoder.
function textDecode(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}

// Generates a cryptographic key using the given string.
export async function genKey(keyStr: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    textEncode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// Creates a JWT with the given key and data.
export async function createJWT(key: CryptoKey, data: Record<string, string>): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = `${base64UrlEncode(textEncode(JSON.stringify(header)))}.${base64UrlEncode(textEncode(JSON.stringify(data)))}`;
  
  const signature = base64UrlEncode(
    new Uint8Array(
      await crypto.subtle.sign({ name: "HMAC" }, key, textEncode(payload)),
    ),
  );

  return `${payload}.${signature}`;
}

// Parses a JWT, verifies it with the given key, and returns the contained data.
export async function parseJWT(key: CryptoKey, jwt: string): Promise<Record<string, string>> {
  const jwtParts = jwt.split(".");
  if (jwtParts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const unsignedData = textEncode(`${jwtParts[0]}.${jwtParts[1]}`);
  const isValid = await crypto.subtle.verify(
    { name: "HMAC" },
    key,
    base64UrlDecode(jwtParts[2]),
    unsignedData,
  );

  if (isValid) {
    return JSON.parse(textDecode(base64UrlDecode(jwtParts[1])));
  } else {
    throw new Error("JWT verification failed");
  }
}
