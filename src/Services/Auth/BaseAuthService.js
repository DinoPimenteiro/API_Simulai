import jwt from "jsonwebtoken";
import RefreshTokenRepo from "../../Repositories/RfshTokenRepo.js";
import ClientRepo from "../../Repositories/ClientRepo.js";
import AdminRepo from "../../Repositories/AdminRepo.js";
import ClientAuthService from "./ClientAuthService.js";
import { ComparePass } from "../../utils/hashUtils.js";
import GeneralValidations from "../../utils/generalValidations.js";

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
          return this.chooseAccount(client, admin);
        }

        if (adminPass) {
          return message = `${process.env.APP_URL}/admin/login/${admin._id}`;
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
          return message = `${process.env.APP_URL}/admin/login/${admin._id}`;
        }
        throw new Error("Invalid credentials");
      }

      if (client) {
        const clientPass = await ComparePass(password, client.passwordHash);
        if (clientPass) {
          const result = await ClientAuthService.clientLogin(
            client._id,
            device
          );
          return result;
        }
        throw new Error("Invalid credentials");
      }

      throw new Error("User not found");
    } catch (err) {
      throw err;
    }
  }

  chooseAccount(admin, client) {
    return {
      admin: `${process.env.APP_URL}/admin/login/${admin._id}`,
      client: `${process.env.APP_URL}/user/login/${client.id}`,
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

      if (!token) {
        throw new Error("Missing token.");
      }

      const userToken = await RefreshTokenRepo.findByToken(token);

      if (!userToken) {
        throw new Error("Invalid token");
      }

      if (userToken.type !== "recover_mail") {
        throw new Error("Token type must be recover_mail");
      }

      if (code === userToken.recoveryCode) {
        const payload = {
          id: userToken.userId,
          email: userToken.userEmail,
          type: "recover-mail",
          role: userToken.role,
        };

        const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "5m",
        });

        return acessToken;
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

      const passwordHash = await GeneralValidations.validatePassword(password);

      const user = await ClientRepo.update(id, {
        passwordHash: passwordHash,
      });

      if (user) {
        const discartTk = await RefreshTokenRepo.destroyManyTokens(id);

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
