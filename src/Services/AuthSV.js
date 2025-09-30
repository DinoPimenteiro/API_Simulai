import crypto from "crypto";
import jwt from "jsonwebtoken";
import RefreshTokenRepo from "../Repositories/RfshTokenRepo.js";
import ClientRepo from "../Repositories/ClientRepo.js";
import mailService from "./MailSV.js";
import { ComparePass, cryptoHash, PassHash } from "../utils/hashUtils.js";
import getToken from "../utils/getToken.js";
import GeneralValidations from "../utils/generalValidations.js";
import AdminRepo from "../Repositories/AdminRepo.js";
import { verifyTOTP } from "../config/2FAConfig.js";
import InviteTokenRepo from "../Repositories/InviteTokenRepo.js";

class authService {
  //Login
  async authenticate(req) {
    try {
      const { password, email } = req.body;
      const device = req.headers["user-agent"];

      if (!device) {
        throw new Error("missing user-agent.");
      }

      GeneralValidations.validateEmail(email);

      const client = await ClientRepo.findEmail(email);

      if (!client) {
        const admin = await AdminRepo.findByEmail(email);

        if (!admin) {
          throw new Error("");
        }

        console.log(password, admin.passwordHash);
        const validAdmin = await ComparePass(password, admin.passwordHash);

        if (validAdmin) {
          const payload = {
            id: admin._id,
            email: admin.email,
            type: "acess",
            role: "Boss",
          };

          const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "15m",
          });

          const rawToken = crypto.randomBytes(40).toString("hex");
          const hashToken = cryptoHash(rawToken);

          const savedToken = await RefreshTokenRepo.saveToken({
            token: hashToken,
            userId: admin._id,
            userEmail: admin.email,
            type: "acess",
            role: admin.role,
            device: device,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });

          if (!savedToken) {
            throw new Error("Not possible to save in database.");
          }

          // Mudar depois, manter só para testes
          return {
            acessToken: acessToken,
            rawToken: rawToken,
          };
        }
      }

      const user = await ComparePass(password, client.passwordHash);

      if (user) {
        const payload = {
          id: client._id,
          email: client.email,
          type: "acess",
          role: "user",
        };

        const acessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "15m",
        });

        const rawToken = crypto.randomBytes(40).toString("hex");
        const hashToken = cryptoHash(rawToken);

        const savedToken = await RefreshTokenRepo.saveToken({
          token: hashToken,
          userId: client._id,
          userEmail: client.email,
          type: "acess",
          role: "user",
          device: device,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        if (!savedToken) {
          throw new Error("Not possible to save in database.");
        }

        // Mudar depois, manter só para testes
        return {
          acessToken: acessToken,
          rawToken: rawToken,
        };
      } else {
        throw new Error("Invalid credentials.");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async refresh(req) {
    try {
      const device = req.headers["user-agent"];
      const rawToken = getToken(req);

      if (!rawToken) {
        throw new Error("Token not found.");
      }

      //Verificar antes de buscar no banco para não sobrecarregar.
      const hashedToken = cryptoHash(rawToken);

      const refreshToken = await RefreshTokenRepo.findByToken(hashedToken);

      // Dá pra pôr validação por tempo também. Seria bom.
      if (!refreshToken) {
        throw new Error("Invalid token.");
      }

      if (!device) {
        throw new Error("Missing device.");
      }

      if (refreshToken.type !== "acess") {
        throw new Error("O token precisa ser do tipo: acess");
      }

      const payload = {
        id: refreshToken.userId,
        email: refreshToken.userEmail,
        type: refreshToken.type,
        role: refreshToken.role,
      };

      const newAcessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const newRawToken = crypto.randomBytes(40).toString("hex");
      const newHashedToken = cryptoHash(newRawToken);

      const updatedToken = await RefreshTokenRepo.refreshToken(
        refreshToken._id,
        {
          token: newHashedToken,
          userId: refreshToken.userId,
          userEmail: refreshToken.userEmail,
          device,
          expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      );

      if (!updatedToken) {
        throw new Error("Erro ao renovar.");
      }

      return {
        updatedToken: updatedToken,
        newAcessToken: newAcessToken,
        newRawToken: newRawToken,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async logout(req) {
    try {
      const token = getToken(req);

      if (!token) {
        throw new Error("Token not found.");
      }

      const hashed = cryptoHash(token);
      const refreshToken = await RefreshTokenRepo.findByToken(hashed);

      if (!refreshToken) {
        throw new Error("Invalid token.");
      }

      if (refreshToken.type !== "acess") {
        throw new Error("O token precisa ser de acesso.");
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
      throw new Error(err.message);
    }
  }

  async recoveryMail(req) {
    try {
      const { email } = req.body;
      const device = req.headers["user-agent"];

      if (!device) {
        throw new Error("Not identified device.");
      }

      GeneralValidations.validateEmail(email);

      const user = await ClientRepo.findEmail(email);

      if (!user) {
        throw new Error("User was not found");
      }

      const { sent, code } = await mailService.sendEmail(email);

      const newRawToken = crypto.randomBytes(40).toString("hex");
      const newHashedToken = cryptoHash(newRawToken);

      if (sent.accepted) {
        const refreshTk = await RefreshTokenRepo.saveToken({
          userId: user._id,
          userEmail: user.email,
          role: "client",
          type: "recover_mail",
          token: newHashedToken,
          device,
          recoveryCode: code,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        return {
          refreshTk,
          newRawToken,
          sent,
        };
      } else {
        throw new Error("failed.");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async verifyCode(req) {
    try {
      const { code } = req.body;
      const token = getToken(req);

      if (!token) {
        throw new Error("Missing token.");
      }

      const hashedToken = cryptoHash(token);

      const userToken = await RefreshTokenRepo.findByToken(hashedToken);

      if (!userToken) {
        throw new Error("");
      }

      if (userToken.type !== "recover_mail") {
        throw new Error("Token type must be recover_mail");
      }

      if (code === userToken.recoveryCode) {
        const payload = {
          id: userToken.userId,
          email: userToken.userEmail,
          type: "recover",
          role: "client",
        };

        const acessTk = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "5m",
        });

        return acessTk;
      } else {
        throw new Error("Invalid code.");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async resetPassword(req) {
    try {
      const { password } = req.body;

      GeneralValidations.validatePassword(password);

      const passwordHash = PassHash(password);

      const user = await ClientRepo.update(req.user.id, {
        passwordHash: passwordHash,
      });

      if (user) {
        const discartTk = await RefreshTokenRepo.destroyManyTokens(req.user.id);

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
      throw new Error(err.message);
    }
  }

  async sendRecruitEmail(req) {
    try {
      const { email } = req.body;

      const rawToken = getToken(req);

      if (!rawToken) {
        throw new Error("refresh Token was not found.");
      }

      const hashedToken = cryptoHash(rawToken);

      const token = await RefreshTokenRepo.findByToken(hashedToken);

      if (!token) {
        throw new Error("Token was not found in database.");
      }

      if (token.role !== "Boss") {
        throw new Error("Unauthorized.");
      }

      const { sent, invitationaLink } = await mailService.recruitEmail(email);

      if (sent.accepted) {
        return {
          invitationaLink,
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // Cadastro de admin
  async validateInvite(req) {
    try {
      const { id } = req.params;

      const newInvite = await InviteTokenRepo.findById(id);

      if (!newInvite) {
        throw new Error("Invite admin error");
      }

      if (newInvite.used) {
        throw new Error("Invite admin");
      }

      return {
        email: newInvite.email,
        qrcode: newInvite.qrcode,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async authenticateAdmin(req) {
    try {
      const { id } = req.params;
      const device = req.headers["user-agent"];

      const { name, email, age, password, code } = req.body;
      let passwordHash;
      let codigo;

      // Pôr verificação de dispositivo para atividade suspeita.
      if (!device) {
        throw new Error("Missing device.");
      }

      // Utilizar o mesmo email que o convite foi utilizado.
      const newAdm = await InviteTokenRepo.findById(id);

      if (!newAdm) {
        throw new Error("Invite admin error");
      }

      if (newAdm.used) {
        throw new Error("Invite admin expired");
      }

      //Colocar validação de tempo;'

      GeneralValidations.validateEmail(email);
      GeneralValidations.validateAge(age);
      GeneralValidations.validateName(name);

      if (GeneralValidations.validatePassword(password)) {
        passwordHash = await PassHash(password);
      }

      codigo = code.toString();
      verifyTOTP(newAdm.secret, codigo);

      console.log(newAdm.secret)
      const newManager = await AdminRepo.save({
        name,
        email,
        passwordHash,
        age,
        secret: newAdm.secret,
        role: "Manager",
      });

      newAdm.used = true;
      await newAdm.save();

      return newManager;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default new authService();
