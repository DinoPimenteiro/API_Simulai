import validator from "validator";
import { Capitalize } from "../utils/stringUtils.js";
import { PassHash } from "../utils/hashUtils.js";
import AdminRepo from "../Repositories/AdminRepo.js";
import ClientRepo from "../Repositories/ClientRepo.js";

class bossService {
  async register(req) {
    let { name, email, password, age } = req.body;

    let passwordHash;

    age = parseInt(age, 10);
    name = validator.trim(Capitalize(name));

    if (!validator.isEmail(email)) {
      throw new Error("Invalid email.");
    }

    if (name == "") {
      throw new Error("Invalid name.");
    }

    if (age < 18 || isNaN(age)) {
      throw new Error("Invalid age.");
    }

    //Consultar docs
    if (validator.isStrongPassword(password)) {
      passwordHash = await PassHash(password);
    } else {
      throw new Error("Weak password.");
    }

    try {
      const adminExists = await AdminRepo.findByEmail(email);

      if (adminExists) {
        throw new Error(`Entity already exists.`);
      }

      const newAdmin = await AdminRepo.save({ name, email, age, passwordHash });

      return {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        age: newAdmin.age,
      };
    } catch (err) {
      throw new Error(`error: ${err.message}`);
    }
  }

  async deleteComment(commentId, clientId) {
    try {
      const { comment } = await ClientRepo.destroyComment(commentId, clientId);

      if (comment) {
        return comment;
      } else {
        throw new Error("Not possible to delete comment.");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async selectAll() {
    try {
      const admins = await AdminRepo.getAll();

      const treatedUsers = admins.map((admin) => {
        let objct = {};

        for (let key in admin) {
          if (key === "passwordHash") continue;
          objct[key] = admin[key];
        }
        return objct;
      });

      return treatedUsers;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async selectOne(id) {
    try {
      const admin = await AdminRepo.findById(id)

      if (!admin) {
        throw new Error("Manager not found.");
      }

      return {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        age: admin.age,
        function: admin.role,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default new bossService();
