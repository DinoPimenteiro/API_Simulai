import AdminRepo from "../Repositories/AdminRepo.js";
import validator from "validator";
import ClientRepo from "../Repositories/ClientRepo.js";
import { Capitalize } from "../utils/stringUtils.js";
import GeneralValidations from "../utils/generalValidations.js";

class adminService {
  async register(req) {
    var { name, email, password, age } = req.body;
    var passwordHash;

    age = parseInt(age, 10);
    name = validator.trim(Capitalize(name));

    try {
      const exists = await AdminRepo.findByEmail(email);

      if (exists) {
        throw new Error(`The user already exists.`);
      }

      //Consultar docs
      passwordHash = await GeneralValidations.validatePassword(password);

      GeneralValidations.validateEmail(email);

      GeneralValidations.validateName(name);

      GeneralValidations.validateAge(age);

      const admin = await AdminRepo.save({
        name,
        email,
        age,
        passwordHash,
        role: "Boss",
      });

      return {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        age: admin.age,
        role: admin.role,
      };
    } catch (err) {
      throw new Error(`server error: ${err.message}`);
    }
  }

  async getEvaluationComment() {
    try {
      const usersComments = await ClientRepo.findComment("Evaluation");

      if (!usersComments) {
        throw new Error("Not possible to find users.");
      }
      const allComments = usersComments.map((comment) => ({
        id: comment.id,
        email: comment.email,
        comments: comment.comment,
      }));

      return allComments;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getHelpComment() {
    try {
      const usersComments = await ClientRepo.findComment("Help");

      if (!usersComments) {
        throw new Error("Not possible to find users.");
      }
      const allComments = usersComments.map((comment) => ({
        id: comment.id,
        email: comment.email,
        comments: comment.comment,
      }));

      return allComments;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const userID = userId;
      const commentID = commentId;

      if (!userID || !commentID) {
        throw new Error("Missing parameters.");
      }

      const client = await ClientRepo.findID(userID);

      if (!client) {
        throw new Error("Client doesn't exists.");
      }

      const removedComment = await ClientRepo.deleteComment(userID, commentID);

      if (removedComment) {
        return {
          message: "Comentário removido.",
          removedComment
        };
      } else {
        throw new Error("erro ao comentário")
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default new adminService();
