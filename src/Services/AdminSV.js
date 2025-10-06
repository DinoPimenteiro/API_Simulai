import validator from "validator";
import { authenticator } from "otplib";
import AdminRepo from "../Repositories/AdminRepo.js";
import ClientRepo from "../Repositories/ClientRepo.js";
import { Capitalize } from "../utils/stringUtils.js";
import GeneralValidations from "../utils/generalValidations.js";
import { validStatus } from "../utils/userValidator.js";

class adminService {
  async register(req) {
    let { name, email, password, age } = req.body;
    let passwordHash;
    // let secret;

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
        // secret: será??? qrcode?????
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

  async getComment(type) {
    try {
      const usersComments = await ClientRepo.findComments(type);

      if (!usersComments) {
        throw new Error("Not possible to find users.");
      }

      return usersComments;
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
          removedComment,
        };
      } else {
        throw new Error("erro ao comentário");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateCommentStatus(parametersId, newStatus) {
    try {
      let { status } = newStatus;
      const { userId, commentId } = parametersId;

      if (!validStatus(status)) {
        throw new Error("Invalid Status.");
      }

      const updatedComment = await ClientRepo.updateComment(
        userId,
        commentId,
        status
      );

      if (updatedComment) {
        return updatedComment;
      } else {
        throw new Error("Something goes wrong.");
      }
    } catch (err) {
      throw err;
    }
  }

  async getAllAdmins() {
    try {
      const admins = await AdminRepo.getAll();

      if (admins) {
        return {
          id: admins._id,
          name: admins.name,
          email: admins.email,
          role: admins.role,
        };
      } else {
        throw new Error("Not possible to list admin.");
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteAdmin(adminId) {
    try {
      const id = adminId;

      const exist = await AdminRepo.findById(id);

      if (!exist) {
        throw new Error("user not found.");
      }

      const deleted = await AdminRepo.deleteAdm(id);

      if (deleted) {
        return deleted;
      } else {
        throw new Error("Failed to delete.");
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new adminService();
