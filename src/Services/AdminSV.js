import RefreshTokenRepo from "../Repositories/RfshTokenRepo.js";
import AdminRepo from "../Repositories/AdminRepo.js";
import validator from "validator";
import { PassHash } from "../utils/hashUtils.js";
import { Capitalize } from "../utils/stringUtils.js";
import {
  validateAge,
  validateEmail,
  validateName,
} from "../utils/generalValidations.js";

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
      if (validator.isStrongPassword(password)) {
        passwordHash = await PassHash(password);
      } else {
        throw new Error("Weak password.");
      }

      validateEmail(email);

      validateName(name);

      validateAge(age);

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

  async updateArchives() {}
  async editComment() {}
}

export default new adminService();
