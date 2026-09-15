/**
 * Prints an ADMIN_PASSWORD_HASH and a fresh ADMIN_SESSION_SECRET.
 *
 *   npm run admin:hash-password
 *
 * The password is read from the terminal without echo and never written
 * anywhere. Put the two printed lines in .env.local (development) or the
 * host's environment settings (production). Never commit them.
 *
 * Mirrors hashPassword() in src/lib/admin/crypto.ts; tests/admin-crypto.test.ts
 * checks that a hash in this format verifies.
 */
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await ask("管理画面のパスワード（12文字以上）: ");
if (password.length < 12) {
  console.error("12文字以上にしてください。");
  process.exit(1);
}
const again = await ask("もう一度: ");
if (password !== again) {
  console.error("一致しません。");
  process.exit(1);
}

const N = 32768, r = 8, p = 1, keylen = 32;
const salt = randomBytes(16);
const key = await new Promise((resolve, reject) =>
  scrypt(password, salt, keylen, { N, r, p, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? reject(e) : resolve(k))),
);

// ":" not "$": Next.js expands "$NAME" in .env files, which would corrupt the hash.
console.log(`\nADMIN_PASSWORD_HASH=${["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(":")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log("\n.env.local（またはホスティング先の環境変数）に設定してください。Gitにはコミットしないでください。");
