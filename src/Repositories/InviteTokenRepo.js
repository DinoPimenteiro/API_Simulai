import InviteToken from "../Models/InviteToken.js";

class InviteTokenRepo {
  async findById(id){
    return InviteToken.findById(id);
  }

  async findByToken(token) {
    return InviteToken.where({ token: token }).findOne();
  }

  async findByUser(mail) {
    return InviteToken.where({ email: mail }).findOne();
  }

  async destroyToken(id) {
    return InviteToken.findByIdAndDelete(id);
  }

  async saveToken(data) {
    return InviteToken.create(data);
  }

  async destroyManyTokens(id) {
    return InviteToken.deleteMany({ userId: id });
  }
}

export default new InviteTokenRepo();
