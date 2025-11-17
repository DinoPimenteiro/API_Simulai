import { Client } from "../Models/Client.js";

class ClientRepo {
  // Manipulção de clientes;
  async findAll() {
    return Client.find().lean();
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

  // Manipulação de comentários;
  async saveComment(user, data) {
    return user.comment.push(data);
  }

  async findComments(type) {
    const commentType = Array.isArray(type) ? type : [type];

    return Client.aggregate([
      {
        $project: {
          _id: 1,
          profileImage: 1,
          name: 1,
          email: 1,
          comments: {
            $filter: {
              input: "$comment",
              as: "c",
              cond: { $in: ["$$c.type", commentType] },
            },
          },
          commentsCount: {
            $size: {
              $filter: {
                input: "$comment",
                as: "c",
                cond: { $in: ["$$c.type", commentType] },
              },
            },
          },
        },
      },
    ]);
  }

  async deleteComment(userId, commentId) {
    return Client.updateOne(
      { _id: userId },
      { $pull: { comment: { _id: commentId } } }
    );
  }

  async updateComment(clientId, commentId, newStatus) {
    return Client.updateOne(
      { _id: clientId, "comment._id": commentId },
      { $set: { "comment.$.status": newStatus } }
    );
  }

  // Métricas de usuários;

  async totalUsers() {
    const totalUsers = await Client.countDocuments({ active: true });
    return totalUsers;
  }

  async averageAge() {
    const result = await Client.aggregate([
      { $group: { _id: null, averageAge: { $avg: "$age" } } },
    ]);

    return result[0]?.averageAge || 0;
  }

  async ageFilter(gte, lte) {
    const count = await Client.countDocuments({
      age: { $gte: gte, $lte: lte },
    });
    return count;
  }

  async averageRating() {
    const result = await Client.aggregate([
      { $group: { _id: null, averageRate: { $avg: "$rate" } } },
    ]);

    return result[0]?.averageRate || 0;
  }

  // Nivel médio.

}

export default new ClientRepo();
