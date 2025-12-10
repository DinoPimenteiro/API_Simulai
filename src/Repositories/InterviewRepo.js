import Interview from "../Models/Interview.js";
import mongoose from "mongoose";

class InterviewRepo {
  async createInterview(data) {
    return Interview.create(data);
  }

  async findBySessionId(session_id) {
    return Interview.findOne({ session_id });
  }

  async findByUserId(userId) {
    return Interview.find({ user: userId });
  }

  async deleteAllByUser(userId) {
    return Interview.deleteMany({ user: userId });
  }

  async deleteOneByUser(userId) {
    return Interview.findByIdAndDelete({ user: userId });
  }

  async deleteOne(session) {
    return Interview.findOneAndDelete({ session_id: session });
  }

  async getFeedbackUser(userId) {
    const result = await Interview.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: null,
          totalCoerencia: { $sum: "$feedback.coerencia" },
          totalComunicacao: { $sum: "$feedback.comunicacao" },
          totalClareza: { $sum: "$feedback.clareza" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalCoerencia: 1,
          totalComunicacao: 1,
          totalClareza: 1,
          count: 1,
          mediaCoerencia: {
            $round: [{ $divide: ["$totalCoerencia", "$count"] }, 2],
          },
          mediaComunicacao: {
            $round: [{ $divide: ["$totalComunicacao", "$count"] }, 2],
          },
          mediaClareza: {
            $round: [{ $divide: ["$totalClareza", "$count"] }, 2],
          },
        },
      },
    ]);

    return (
      result[0] || {
        totalCoerencia: 0,
        totalComunicacao: 0,
        totalClareza: 0,
        mediaCoerencia: 0,
        mediaComunicacao: 0,
        mediaClareza: 0,
        count: 0,
      }
    );
  }
}

export default new InterviewRepo();
