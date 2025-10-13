import RefreshToken from "../Models/RefreshToken.js";
import { cryptoHash } from "../utils/hashUtils.js";

class RefreshTokenRepo {
  async findByToken(raw) {
    const token = cryptoHash(raw);
    return RefreshToken.findOne({ token });
  }

  async findByUser(id) {
    return RefreshToken.where({ userId: id }).findOne();
  }

  async findByUserEmail(email) {
    return RefreshToken.find({ userEmail: email });
  }

  async destroyToken(id) {
    return RefreshToken.findByIdAndDelete(id);
  }

  async refreshToken(id, data) {
    return RefreshToken.findByIdAndUpdate(id, data);
  }

  async saveToken(data) {
    return RefreshToken.create(data);
  }

  async destroyManyTokens(id) {
    return RefreshToken.deleteMany({ userId: id });
  }
}

export default new RefreshTokenRepo();
