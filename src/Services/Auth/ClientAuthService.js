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

        const existsToken = await RfshTokenRepo.findByUserEmail(user.email);

        if (existsToken.length > 0) {
          const { body, rawToken } = TokenAuthService.getRefreshToken(
            user,
            "acess",
            device,
            existsToken[0].expiresAt
          );

          const updatedToken = await RfshTokenRepo.refreshToken(
            existsToken[0]._id,
            body
          );

          if (updatedToken) {
            return { updatedToken, acessToken, rawToken };
          }
        } else {
          const { body, rawToken } = TokenAuthService.getRefreshToken(
            user,
            "acess",
            device,
            expirationTime
          );
          const refreshTk = await RfshTokenRepo.saveToken(body);
          return { acessToken, rawToken };
        }
      } else {
        throw new Error("User doesn´t exists");
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new ClientAuthService();
