import { describe, expect, it } from "vitest";
import { b64url, encryptPayload, importKeyPair, isPushEndpoint, vapidAuthorization } from "../worker/push/webpush";

/** RFC 8291 §5 and Appendix A: the worked example, byte for byte. */
const rfc = {
  plaintext: "V2hlbiBJIGdyb3cgdXAsIEkgd2FudCB0byBiZSBhIHdhdGVybWVsb24",
  asPublic: "BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8",
  asPrivate: "yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw",
  uaPublic: "BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4",
  auth: "BTBZMqHH6r4Tts7J_aSIgg",
  salt: "DGv6ra1nlYgDCS1FRnbzlw",
  header: "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8",
  ciphertext: "8pfeW0KbunFT06SuDKoJH9Ql87S1QUrdirN6GcG7sFz1y1sqLgVi1VhjVkHsUoEsbI_0LpXMuGvnzQ",
  message:
    "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN",
};

describe("Web Push encryption (RFC 8291)", () => {
  it("reproduces the RFC's worked example exactly", async () => {
    const sender = await importKeyPair(b64url.decode(rfc.asPublic), b64url.decode(rfc.asPrivate), "ECDH");
    const body = await encryptPayload(b64url.decode(rfc.plaintext), { p256dh: rfc.uaPublic, auth: rfc.auth }, { salt: b64url.decode(rfc.salt), sender });
    const header = b64url.decode(rfc.header);
    expect(b64url.encode(body.slice(0, header.length))).toBe(rfc.header);
    expect(b64url.encode(body.slice(header.length))).toBe(rfc.ciphertext);
    expect(b64url.encode(body)).toBe(rfc.message);
  });

  it("uses a fresh salt and sender key for every message", async () => {
    const a = await encryptPayload(new TextEncoder().encode("x"), { p256dh: rfc.uaPublic, auth: rfc.auth });
    const b = await encryptPayload(new TextEncoder().encode("x"), { p256dh: rfc.uaPublic, auth: rfc.auth });
    expect(b64url.encode(a.slice(0, 16))).not.toBe(b64url.encode(b.slice(0, 16)));
    expect(b64url.encode(a.slice(21, 86))).not.toBe(b64url.encode(b.slice(21, 86)));
  });

  it("refuses keys that are not a browser subscription's", async () => {
    await expect(encryptPayload(new Uint8Array([1]), { p256dh: rfc.auth, auth: rfc.auth })).rejects.toThrow();
    await expect(encryptPayload(new Uint8Array([1]), { p256dh: rfc.uaPublic, auth: rfc.uaPublic })).rejects.toThrow();
  });
});

describe("VAPID (RFC 8292)", () => {
  it("signs a JWT for the push service's origin that the public key verifies", async () => {
    const pair = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
    const publicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
    const d = (await crypto.subtle.exportKey("jwk", pair.privateKey)).d!;
    const vapid = { publicKey: b64url.encode(publicRaw), privateKey: d, subject: "https://kigyo-hyakka.com/contact" };
    const now = Date.UTC(2026, 10, 17);
    const header = await vapidAuthorization("https://fcm.googleapis.com/fcm/send/abc", vapid, now);
    const [, token, key] = /^vapid t=([^,]+), k=(.+)$/.exec(header)!;
    expect(key).toBe(vapid.publicKey);
    const [h, c, s] = token!.split(".");
    const claims = JSON.parse(new TextDecoder().decode(b64url.decode(c!)));
    expect(claims).toEqual({ aud: "https://fcm.googleapis.com", exp: now / 1000 + 12 * 3600, sub: "https://kigyo-hyakka.com/contact" });
    const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pair.publicKey, b64url.decode(s!), new Uint8Array(new TextEncoder().encode(`${h}.${c}`)));
    expect(ok).toBe(true);
    // The subject is the site's contact page: no person's e-mail address is sent to a push service.
    expect(header).not.toMatch(/mailto:|@/);
  });
});

describe("push service addresses", () => {
  it("accepts the browsers' push services only", () => {
    for (const ok of ["https://fcm.googleapis.com/fcm/send/x", "https://updates.push.services.mozilla.com/wpush/v2/x", "https://web.push.apple.com/Qx", "https://db5p.notify.windows.com/w/?token=x"]) {
      expect(isPushEndpoint(ok), ok).toBe(true);
    }
    for (const bad of ["http://fcm.googleapis.com/x", "https://fcm.googleapis.com.evil.example/x", "https://evil.example/fcm.googleapis.com", "https://kigyo-hyakka.com/api/push", "https://user:pw@fcm.googleapis.com/x", "https://fcm.googleapis.com:8443/x", "https://169.254.169.254/latest", 42, null]) {
      expect(isPushEndpoint(bad), String(bad)).toBe(false);
    }
  });
});
