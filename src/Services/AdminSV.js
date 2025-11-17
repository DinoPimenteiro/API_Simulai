import validator from "validator";
import AdminRepo from "../Repositories/AdminRepo.js";
import ClientRepo from "../Repositories/ClientRepo.js";
import { Capitalize } from "../utils/stringUtils.js";
import GeneralValidations from "../utils/generalValidations.js";
import { validStatus } from "../utils/userValidator.js";

class adminService {
  async register(data) {
    let { name, email, password, age } = data;
    let passwordHash;
    // let secret;

    age = parseInt(age, 10);
    name = validator.trim(Capitalize(name));

    try {
      const exists = await AdminRepo.findByEmail(email);

      if (exists) {
        throw new Error(`The user already exists.`);
      }

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

      if (admin) {
        return {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          age: admin.age,
          role: admin.role,
        };
      } else {
        throw new Error("failed to register admin");
      }
    } catch (err) {
      throw err;
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
      throw err;
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const commentID = commentId;
      const userID = userId;

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
        throw new Error("erro ao deletar comentário");
      }
    } catch (err) {
      throw err;
    }
  }

  async updateCommentStatus(parametersId, newStatus) {
    try {
      const { userId, commentId } = parametersId;
      let { status } = newStatus;

      if (!validStatus(status)) {
        throw new Error("Invalid Status.");
      }

      if (!userId || !commentId) {
        throw new Error("Missing parameters");
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

      if (!admins) throw new Error("Not possible to list admin.");

      const adm = admins.map((admin) => {
        let objct = {};

        for (let i in admin) {
          if (i === "passwordHash" || i === "secret") continue;
          objct[i] = admin[i];
        }

        return objct;
      });

      return adm;
    } catch (err) {
      throw err;
    }
  }

  async deleteAdmin(adminId) {
    try {
      const id = adminId;

      if (!id) throw new Error("Missing ID");

      const exist = await AdminRepo.findById(id);

      if (!exist || exist.role === "Boss") {
        throw new Error("Invalid user");
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
