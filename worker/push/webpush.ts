/**
 * Web Push sending, written for Workers on WebCrypto alone (JCE-059): the payload is encrypted for the browser that
 * subscribed (RFC 8291, aes128gcm of RFC 8188), and the request is signed with the site's VAPID key (RFC 8292). No
 * library: what the push service receives is exactly what is written here, and tests/push-crypto.test.ts checks it
 * against the worked example of RFC 8291.
 */

/** Bytes backed by a plain ArrayBuffer — what WebCrypto accepts. */
export type Bytes = Uint8Array<ArrayBuffer>;

export const b64url = {
  encode(bytes: Uint8Array): string {
    let s = "";
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  decode(text: string): Bytes {
    const t = text.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(t + "=".repeat((4 - (t.length % 4)) % 4));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  },
};

const enc = { encode: (text: string): Bytes => new Uint8Array(new TextEncoder().encode(text)) };

function concat(...parts: Uint8Array[]): Bytes {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

async function hkdf(salt: Bytes, ikm: Bytes, info: Bytes, length: number): Promise<Bytes> {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, length * 8));
}

/** A P-256 key pair from its raw parts: 65-byte uncompressed public point and 32-byte private scalar. */
export async function importKeyPair(publicRaw: Bytes, privateRaw: Bytes, use: "ECDH" | "ECDSA") {
  const jwk: JsonWebKey = {
    kty: "EC",
    crv: "P-256",
    x: b64url.encode(publicRaw.slice(1, 33)),
    y: b64url.encode(publicRaw.slice(33, 65)),
    d: b64url.encode(privateRaw),
    ext: true,
  };
  const algorithm = use === "ECDH" ? { name: "ECDH", namedCurve: "P-256" } : { name: "ECDSA", namedCurve: "P-256" };
  const privateKey = await crypto.subtle.importKey("jwk", jwk, algorithm, false, use === "ECDH" ? ["deriveBits"] : ["sign"]);
  return { publicRaw, privateKey };
}

export type EncryptOptions = {
  /** Fixed values for the RFC's worked example; a real message draws both at random. */
  salt?: Bytes;
  sender?: { publicRaw: Bytes; privateKey: CryptoKey };
  recordSize?: number;
};

/**
 * RFC 8291: the body a push service carries to the browser, readable only with the subscription's private key.
 * One record: header (salt, record size, sender key) then the AES-GCM ciphertext of the payload and its 0x02 delimiter.
 */
export async function encryptPayload(
  payload: Uint8Array,
  subscription: { p256dh: string; auth: string },
  options: EncryptOptions = {},
): Promise<Bytes> {
  const uaPublic = b64url.decode(subscription.p256dh);
  const authSecret = b64url.decode(subscription.auth);
  if (uaPublic.length !== 65 || uaPublic[0] !== 4) throw new Error("p256dh is not an uncompressed P-256 point");
  if (authSecret.length !== 16) throw new Error("auth secret must be 16 bytes");

  let sender = options.sender;
  if (!sender) {
    const pair = (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
    sender = { publicRaw: new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey)), privateKey: pair.privateKey };
  }
  const salt = options.salt ?? crypto.getRandomValues(new Uint8Array(16));
  const recordSize = options.recordSize ?? 4096;

  const uaKey = await crypto.subtle.importKey("raw", uaPublic, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdhSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, sender.privateKey, 256));
  const keyInfo = concat(enc.encode("WebPush: info\0"), uaPublic, sender.publicRaw);
  const ikm = await hkdf(authSecret, ecdhSecret, keyInfo, 32);
  const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 12);

  const padded = concat(payload, new Uint8Array([2]));
  if (padded.length + 16 > recordSize) throw new Error("payload too large for one record");
  const aesKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, padded));

  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, recordSize);
  return concat(salt, rs, new Uint8Array([sender.publicRaw.length]), sender.publicRaw, ciphertext);
}

export type Vapid = { publicKey: string; privateKey: string; subject: string };

/** RFC 8292: `Authorization: vapid t=<JWT>, k=<public key>` for one push service origin, valid for 12 hours. */
export async function vapidAuthorization(endpoint: string, vapid: Vapid, now = Date.now()): Promise<string> {
  const { privateKey } = await importKeyPair(b64url.decode(vapid.publicKey), b64url.decode(vapid.privateKey), "ECDSA");
  const header = b64url.encode(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const claims = b64url.encode(
    enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(now / 1000) + 12 * 3600, sub: vapid.subject })),
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, enc.encode(`${header}.${claims}`)),
  );
  return `vapid t=${header}.${claims}.${b64url.encode(signature)}, k=${vapid.publicKey}`;
}

export type StoredSubscription = { endpoint: string; p256dh: string; auth: string };

/**
 * Sends one notification. "gone" when the push service says the subscription no longer exists (404/410), so the
 * caller deletes it; "failed" for anything else, which is retried at the next run.
 */
export async function sendPush(
  subscription: StoredSubscription,
  message: object,
  vapid: Vapid,
  send: typeof fetch = fetch,
): Promise<"sent" | "gone" | "failed"> {
  const body = await encryptPayload(enc.encode(JSON.stringify(message)), subscription);
  const response = await send(subscription.endpoint, {
    method: "POST",
    headers: {
      authorization: await vapidAuthorization(subscription.endpoint, vapid),
      "content-encoding": "aes128gcm",
      "content-type": "application/octet-stream",
      ttl: String(3 * 24 * 3600),
      urgency: "normal",
    },
    body,
  });
  if (response.status === 404 || response.status === 410) return "gone";
  return response.ok ? "sent" : "failed";
}

/**
 * Push services a browser may hand out. A subscription naming any other host is refused, so the worker can never be
 * made to send requests to an address of a caller's choosing.
 */
const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /^updates\.push\.services\.mozilla\.com$/,
  /^[a-z0-9-]+\.push\.services\.mozilla\.com$/,
  /^web\.push\.apple\.com$/,
  /^[a-z0-9-]+\.push\.apple\.com$/,
  /^[a-z0-9-]+\.notify\.windows\.com$/,
];

export function isPushEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > 1024) return false;
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && PUSH_HOSTS.some((h) => h.test(url.hostname));
  } catch {
    return false;
  }
}
