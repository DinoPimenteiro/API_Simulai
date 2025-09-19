import validator from "validator";
import { Capitalize } from "../utils/stringUtils.js";
import { PassHash } from "../utils/hashUtils.js";
import AdminRepo from "../Repositories/AdminRepo.js";

class adminService {
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
        throw new Error(`The entity already exists.`);
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

  async login() {}
  async updateArchives() {}
  async editComment() {}
}

export default new adminService();
