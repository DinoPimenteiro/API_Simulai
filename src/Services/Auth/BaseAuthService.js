import jwt from "jsonwebtoken";
import validator from "validator";
import RefreshTokenRepo from "../../Repositories/RfshTokenRepo.js";
import ClientRepo from "../../Repositories/ClientRepo.js";
import AdminRepo from "../../Repositories/AdminRepo.js";
import ClientAuthService from "./ClientAuthService.js";
import { ComparePass, cryptoHash } from "../../utils/hashUtils.js";
import GeneralValidations from "../../utils/generalValidations.js";
import AdminAuthService from "./AdminAuthService.js";

class AuthService {
  //Login
  async authenticate(userdata, headers) {
    try {
      const { password, email } = userdata;
      const device = headers;
      let message;

      GeneralValidations.validateDevice(device);
      GeneralValidations.validateEmail(email);

      const client = await ClientRepo.findEmail(email);
      const admin = await AdminRepo.findByEmail(email);

      if (client && admin) {
        const clientPass = await ComparePass(password, client.passwordHash);
        const adminPass = await ComparePass(password, admin.passwordHash);

        if (clientPass && adminPass) {
          return this.chooseAccount(admin, client);
        }

        if (adminPass) {
          try {
            const { acessToken, rawToken } =
              await AdminAuthService.validateBoss(admin._id, device);
            return { acessToken, rawToken };
          } catch (_) {
            message = `${process.env.APP_URL}/admin/login/${admin._id}`;
            return { message };
          }
        }
        if (clientPass) {
          const result = await ClientAuthService.clientLogin(
            client._id,
            device
          );
          return result;
        }
        throw new Error("Invalid credentials");
      }

      if (admin) {
        const adminPass = await ComparePass(password, admin.passwordHash);
        if (adminPass) {
          try {
            const { acessToken, rawToken } =
              await AdminAuthService.validateBoss(admin._id, device);
            return { acessToken, rawToken };
          } catch (_) {
            message = `${process.env.APP_URL}/admin/login/${admin._id}`;
            return { message };
          }
        }
        throw new Error("Invalid credentials");
      }

      if (client) {
        const clientPass = await ComparePass(password, client.passwordHash);
        if (clientPass) {
          const { updatedToken, rawToken, acessToken } =
            await ClientAuthService.clientLogin(client._id, device);

          if (updatedToken) {
            return { updatedToken, rawToken, acessToken };
          } else {
            return { rawToken, acessToken };
          }
        }
        throw new Error("Invalid credentials");
      }

      throw new Error("User not found");
    } catch (err) {
      throw err;
    }
  }
  // rawToken
  // updatedToken
  chooseAccount(admin, client) {
    return {
      message: {
        admin: `${process.env.APP_URL}/admin/login/${admin._id}`,
        client: `${process.env.APP_URL}/user/login/${client.id}`,
      },
    };
  }

  async logout(raw) {
    try {
      const token = raw;

      if (!token) throw new Error("Token not found.");

      const refreshToken = await RefreshTokenRepo.findByToken(token);

      if (!refreshToken) {
        throw new Error("Invalid token.");
      }

      if (refreshToken.type !== "acess") {
        throw new Error("The type of token need to be 'access'");
      }

      const deletedToken = await RefreshTokenRepo.destroyToken(
        refreshToken._id
      );
      ("");

      if (deletedToken) {
        return deletedToken;
      } else {
        throw new Error("Fail to delete token");
      }
    } catch (err) {
      throw err;
    }
  }

  async verifyCode(data, raw) {
    try {
      const { code } = data;
      const token = raw;

      if (!token) throw new Error("Missing token.");

      const userToken = await RefreshTokenRepo.findByToken(token);

      if (!userToken) {
        throw new Error("Invalid token");
      }

      if (userToken.type !== "recover-mail") {
        throw new Error("Token type must be recover-mail");
      }

      if (parseInt(code) === userToken.recoveryCode) {
        const payload = {
          id: userToken.userId,
          email: userToken.userEmail,
          type: "recover-mail",
          role: userToken.role,
        };

        const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "5m",
        });

        return { acessToken, id: userToken.userId };
      } else {
        throw new Error("Invalid code.");
      }
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(data, params) {
    try {
      const { password } = data;
      const { id } = params;

      if (!id || !validator.isHexadecimal(id) || id.length !== 24) {
        throw new Error("Invalid id");
      }
      const passwordHash = await GeneralValidations.validatePassword(password);

      const discartTk = await RefreshTokenRepo.destroyManyTokens(id);

      if (discartTk.deletedCount == 0) {
        throw new Error("You already changed your password. Invalid access");
      }

      const user = await ClientRepo.update(id, {
        passwordHash: passwordHash,
      });

      if (user) {
        return {
          id: user._id,
          email: user.email,
          newPass: password,
          discartTk,
        };
      } else {
        throw new Error("User was not found.");
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
