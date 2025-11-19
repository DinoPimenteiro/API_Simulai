import RefreshTokenRepo from "../../Repositories/RfshTokenRepo.js";
import ClientRepo from "../../Repositories/ClientRepo.js";
import mailService from "../MailSV.js";
import TokenAuthService from "./TokenAuthService.js";
import GeneralValidations from "../../utils/generalValidations.js";

class MailAuthService {
  async recoveryMail(data, headers) {
    try {
      const { email } = data;
      const device = headers;
      let expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      GeneralValidations.validateEmail(email);
      GeneralValidations.validateDevice(device);

      const user = await ClientRepo.findEmail(email);

      GeneralValidations.validateUser(user);

      const existsToken = await RefreshTokenRepo.findByUserEmail(user.email);

      if (existsToken.length > 0) {
        await RefreshTokenRepo.destroyManyTokens(user._id);
      }

      const { code } = await mailService.recoverEmail(email);
      const { body, rawToken } = TokenAuthService.getRefreshToken(
        user,
        "recover-mail",
        device,
        expiresAt,
        code
      );

      if (code) {
        const refreshTk = await RefreshTokenRepo.saveToken(body);

        if (refreshTk) {
          return {
            refreshTk,
            rawToken,
          };
        }
      } else {
        throw new Error("failed to send email");
      }
    } catch (err) {
      throw err;
    }
  }

  async sendRecruitEmail(userEmail, cookieToken) {
    try {
      const { email } = userEmail;
      const rawToken = cookieToken;

      GeneralValidations.validateEmail(email);

      if (!rawToken) throw new Error("refresh Token was not found.");

      const token = await RefreshTokenRepo.findByToken(rawToken);

      if (!token) {
        throw new Error("Token was not found in database");
      }

      if (token.role !== "Boss") {
        throw new Error("Unauthorized.");
      }

      const { invitationaLink, id } = await mailService.recruitEmail(email);
      return {
        invitationaLink,
        id,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default new MailAuthService();
