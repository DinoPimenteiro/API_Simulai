import AdminRepo from "../Repositories/AdminRepo.js";
import validator from "validator";
import { PassHash } from "../utils/hashUtils.js";
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

  async editComment() {

  }

  async updateArchives() {}
}

export default new adminService();
