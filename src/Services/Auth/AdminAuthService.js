import { verifyTOTP } from "../../config/2FAConfig.js";
import RefreshTokenRepo from "../../Repositories/RfshTokenRepo.js";
import InviteTokenRepo from "../../Repositories/InviteTokenRepo.js";
import AdminRepo from "../../Repositories/AdminRepo.js";
import GeneralValidations from "../../utils/generalValidations.js";
import TokenAuthService from "./TokenAuthService.js";

class AdminAuthService {
  async validateAdminCode(id, data, headers) {
    try {
      const { code } = data;
      const device = headers;
      const ID = id;

      const adm = await AdminRepo.findById(ID);

      if (!adm) {
        throw new Error("Invalid ID");
      }

      let DateTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      GeneralValidations.validateUser(adm);
      GeneralValidations.validateDevice(device);

      const acessToken = await TokenAuthService.generateJwt(adm, "acess");

      const { body, rawToken } = TokenAuthService.getRefreshToken(
        adm,
        "acess",
        device,
        DateTime
      );

      if (!code && adm.role === "Boss") {
        const savedToken = await RefreshTokenRepo.saveToken(body);
        if (!savedToken) throw new Error("Not possible to save in database.");

        return {
          acessToken,
          rawToken,
        };
      }

      const verify = verifyTOTP(adm.secret, code);

      const existTokens = await RefreshTokenRepo.findByUser(adm._id);

      if (existTokens && verify) {
        const updatedToken = await RefreshTokenRepo.refreshToken(
          existTokens._id,
          body
        );

        return { updatedToken, acessToken, rawToken: rawToken };
      }

      if (verify) {
        const savedToken = await RefreshTokenRepo.saveToken(body);

        if (!savedToken) throw new Error("Not possible to save in database.");

        return {
          acessToken: acessToken,
          rawToken: rawToken,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  async validateBoss(id, headers) {
    try {
      const device = headers;
      const ID = id;
      let DateTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const adm = await AdminRepo.findById(ID);

      if (!adm) {
        throw new Error("Invalid ID");
      }

      if (adm.role !== "Boss") {
        throw new Error("Invalid Role.");
      }

      GeneralValidations.validateUser(adm);
      GeneralValidations.validateDevice(device);

      const acessToken = await TokenAuthService.generateJwt(adm, "acess");

      const { body, rawToken } = TokenAuthService.getRefreshToken(
        adm,
        "acess",
        device,
        DateTime
      );

      const existToken = await RefreshTokenRepo.findByUser(adm._id);

      if (existToken) {
        await RefreshTokenRepo.refreshToken(existToken._id, body);
        return { rawToken, acessToken };
      }

      if (adm.role === "Boss") {
        const savedToken = await RefreshTokenRepo.saveToken(body);
        if (!savedToken) throw new Error("Not possible to save in database.");

        return {
          acessToken,
          rawToken,
        };
      }
    } catch (err) {
      throw err;
    }
  }
  // Cadastro de admin
  async validateInvite(params) {
    try {
      const { id } = params;

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
      throw err;
    }
  }

  async authenticateAdmin(params, dispo, data) {
    try {
      const { id } = params;
      const device = dispo;
      const { name, email, age, password, code } = data;
      let passwordHash;

      // Pôr verificação de dispositivo para atividade suspeita.
      if (!device) {
        throw new Error("Missing device.");
      }

      // Utilizar o mesmo email que o convite foi utilizado.
      const newAdm = await InviteTokenRepo.findById(id);

      if (!newAdm || email !== newAdm.email) {
        throw new Error("Invite admin error");
      }

      if (newAdm.used) {
        throw new Error("Invite admin expired");
      }

      GeneralValidations.validateEmail(email);
      GeneralValidations.validateAge(age);
      GeneralValidations.validateName(name);

      passwordHash = await GeneralValidations.validatePassword(password);

      verifyTOTP(newAdm.secret, code);

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

      const managerObject = newManager.toObject
        ? newManager.toObject()
        : newManager;

      let { secret, ...info } = managerObject;

      return { newManagerIsane: info || "Sucessful created" };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

export default new AdminAuthService();
