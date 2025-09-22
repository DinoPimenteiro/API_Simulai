import crypto from "crypto";

const tk = crypto.randomUUID();
const hashedToken = crypto.createHash("sha512").update(tk).digest("base64");

console.log(hashedToken);
