import bcrypt from "bcrypt";
import crypto from "crypto";

async function PassHash(passw) {
  const salt = parseInt(process.env.SALT_ROUNDS, 10);
  const rounds = await bcrypt.genSalt(salt);
  const hashedPassword = await bcrypt.hash(passw, rounds);
  return hashedPassword;
}

async function ComparePass(passw, hash) {
  const comp = await bcrypt.compare(passw, hash);
  return comp;
}

// RefreshTokens
function cryptoHash(update, devolution = "hex") {
  const criptography = crypto
    .createHash("sha256")
    .update(update)
    .digest(devolution);
  return criptography;
}

// Invite tokens
function encryptToken(tk) {
  const crypt = crypto.createHash("sha512").update(tk).digest("base64");
  return crypt
}

export { PassHash, ComparePass, cryptoHash, encryptToken };
