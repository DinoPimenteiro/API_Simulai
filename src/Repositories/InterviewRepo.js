import Interview from "../Models/Interview.js";

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
}

export default new InterviewRepo();
