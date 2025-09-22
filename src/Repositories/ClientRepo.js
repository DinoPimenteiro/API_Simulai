import { Client } from "../Models/Client.js";

class ClientRepo {
  async findAll() {
    return Client.find().lean(); // O QUE CARALHOS É LEAN PORRA
  }

  async findID(id) {
    return Client.findById(id);
  }

  async findEmail(email) {
    return Client.where({ email: email }).findOne();
  }

  async destroy(id) {
    return Client.findByIdAndDelete(id);
  }

  async update(id, data) {
    return Client.findByIdAndUpdate(id, data);
  }

  async save(data) {
    return Client.create(data);
  }

  async destroyComment(id, clientId) {
    return Client.findByIdAndUpdate(
      clientId,
      {
        $pull: { comment: { _id: id } },
      },
      { new: true }
    );
  }
}

export default new ClientRepo();
