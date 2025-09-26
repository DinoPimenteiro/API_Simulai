import { authenticator } from "otplib";
import qrcode from "qrcode";

export async function generateTotp(email, appName = "SimulAI") {
  const secret = authenticator.generateSecret();
  const token = authenticator.generate(secret);
  const otppath = authenticator.keyuri(email, appName, secret);
  const qrCodeLink = await qrcode.toDataURL(otppath);
  
  return {
    qrCodeLink,
    secret,
    token
  };
}

export function verifyTOTP(secret, token){
  const validate = authenticator.verify({ secret: secret, token: token });

  if(!validate){
    throw new Error("Invalid credentials.")
  }
}
