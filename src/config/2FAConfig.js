import { authenticator } from "otplib";
import qrcode from "qrcode";
import { encrypt, decrypt } from "../utils/encryptUtils.js";

export async function generateTotp(email, appName = "SimulAI") {
  let secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);
  const otppath = authenticator.keyuri(email, appName, secret);
  const qrCodeLink = await qrcode.toDataURL(otppath);

  secret = encrypt(secret);  
  
  return {
    qrCodeLink,
    secret,
    token
  };
}

export function verifyTOTP(adminSecret, adminToken) {
  let secret = decrypt(adminSecret);
  let token = adminToken.toString();

  const valid = authenticator.verify({ secret, token, window: 2 });
  if (!valid) throw new Error("Código TOTP inválido.");

  return true
}

