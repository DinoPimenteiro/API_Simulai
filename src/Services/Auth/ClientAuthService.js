import ClientRepo from "../../Repositories/ClientRepo.js";
import RfshTokenRepo from "../../Repositories/RfshTokenRepo.js";
import TokenAuthService from "./TokenAuthService.js";
import generalValidations from "../../utils/generalValidations.js";

class ClientAuthService {
  async clientLogin(userId, dispo) {
    try {
      const id = userId;
      const device = dispo;
      const user = await ClientRepo.findID(id);
      let expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const isUser = generalValidations.validateUser(user);
      generalValidations.validateDevice(device);

      if (isUser) {
        const acessToken = await TokenAuthService.generateJwt(user, "acess");
        const { body, rawToken } = TokenAuthService.getRefreshToken(
          user,
          "acess",
          device,
          expirationTime
        );

        const existsToken = await RfshTokenRepo.findByUserEmail(user.email);

        if (existsToken && existsToken.type === "acess") {
          const updateToken = await RfshTokenRepo.refreshToken(
            existsToken._id,
            body
          );
          return { updateToken, acessToken };
        } else {
          const refreshTk = RfshTokenRepo.saveToken(body);
          return { acessToken, rawToken, refreshTk };
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new ClientAuthService();
