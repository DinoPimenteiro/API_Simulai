import crypto from "crypto";
import jwt from "jsonwebtoken";
import RefreshTokenRepo from "../../Repositories/RfshTokenRepo.js";
import { cryptoHash } from "../../utils/hashUtils.js";
import GeneralValidations from "../../utils/generalValidations.js";

class TokenAuthService {
  async refresh(headers, cookieToken) {
    try {
      const device = headers;
      const rawk = cookieToken;

      if (!rawk) {
        throw new Error("Token not found.");
      }

      GeneralValidations.validateDevice(device);
      const refreshToken = await RefreshTokenRepo.findByToken(rawk);

      // Dá pra pôr validação por tempo também. Seria bom.
      if (!refreshToken) throw new Error("Invalid token.");

      if (refreshToken.type !== "acess") {
        throw new Error("The type of token need to be 'acess'");
      }

      const payload = {
        id: refreshToken.userId,
        email: refreshToken.userEmail,
        type: refreshToken.type,
        role: refreshToken.role,
      };

      const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const rawToken = crypto.randomBytes(40).toString("hex");
      const hashedToken = cryptoHash(rawToken);

      const body = {
        userId: refreshToken.userId,
        userEmail: refreshToken.userEmail,
        type: refreshToken.type,
        role: refreshToken.role,
        device: device,
        token: hashedToken, 
        expiresAt: refreshToken.expiresAt,
      };

      const updatedToken = await RefreshTokenRepo.refreshToken(
        refreshToken._id,
        body
      );

      if (!updatedToken) {
        throw new Error("refreshError.");
      }

      return {
        updatedToken,
        acessToken,
        rawToken,
      };
    } catch (err) {
      throw err;
    }
  }

  getRefreshToken(user, type, device, expirationTime, code = null) {
    const rawToken = crypto.randomBytes(40).toString("hex");
    const hashedToken = cryptoHash(rawToken);

    if (code === undefined) {
      code = null;
    }

    const body = {
      token: hashedToken,
      userId: user._id,
      userEmail: user.email,
      type: type,
      role: user.role,
      device: device,
      expiresAt: expirationTime,
      recoveryCode: code,
    };

    return {
      body,
      rawToken,
    };
  }

  async generateJwt(user, type, time = "15m") {
    const payload = {
      id: user._id,
      email: user.email,
      type: type,
      role: user.role,
    };
    const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: time,
    });

    return acessToken;
  }
}

export default new TokenAuthService();
