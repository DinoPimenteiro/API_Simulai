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
      const adm = await AdminRepo.findById(id);
      let DateTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      GeneralValidations.validateUser(adm);
      GeneralValidations.validateDevice(device);

      const verify = verifyTOTP(adm.secret, code);

      if (verify) {
        const acessToken = await TokenAuthService.generateJwt(adm, "acess");

        const { body, rawToken } = getRefreshToken(
          adm,
          "acess",
          device,
          DateTime
        );

        const savedToken = await RefreshTokenRepo.saveToken(body);

        if (!savedToken) throw new Error("Not possible to save in database.");

        // Mudar depois, manter só para testes
        return {
          acessToken: acessToken,
          rawToken: rawToken,
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
      throw new err;
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

      //Colocar validação de tempo;'

      GeneralValidations.validateEmail(email);
      GeneralValidations.validateAge(age);
      GeneralValidations.validateName(name);

      passwordHash = await GeneralValidations.validatePassword(password);

      verifyTOTP(newAdm.secret, code.toString());

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
      throw err;
    }
  }
}

export default new AdminAuthService();