import nodeCrypto from "node:crypto";

/**
 * The Web Crypto API - grabbed from the Node.js library or the global
 */
const webCrypto = nodeCrypto.webcrypto || globalThis.crypto;
/**
 * The SubtleCrypto API for low level crypto operations.
 */
const subtleCrypto = webCrypto.subtle;
const textEncoder = new TextEncoder();

export const saltAndHashPassword = async (email: string, password: string): Promise<string> => {
  if (!process.env.SALT) {
    throw new Error("Salt is not defined in the environment variables.");
  }
  const salt = process.env.SALT;

  return await postgresMd5PasswordHash(email, password, salt);
};

async function md5(string: string) {
  try {
    return nodeCrypto.createHash("md5").update(string, "utf-8").digest("hex");
  } catch (e) {
    // `createHash()` failed so we are probably not in Node.js, use the WebCrypto API instead.
    // Note that the MD5 algorithm on WebCrypto is not available in Node.js.
    // This is why we cannot just use WebCrypto in all environments.
    const data = typeof string === "string" ? textEncoder.encode(string) : string;
    const hash = await subtleCrypto.digest("MD5", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

async function postgresMd5PasswordHash(user: string, password: string, salt: any) {
  var inner = await md5(password + user);
  var outer = await md5(Buffer.concat([Buffer.from(inner), Buffer.from(salt)]).toString());
  return "md5" + outer;
}
