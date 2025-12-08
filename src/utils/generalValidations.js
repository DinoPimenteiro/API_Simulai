import validator from "validator";
import { PassHash } from "./hashUtils.js";
import fs from "fs";

class GeneralValidations {
  validateId(id) {
    if (!id || typeof id !== "string" || !validator.isHexadecimal(id)) {
      throw new Error("ID de usuário inválido.");
    }

    return true;
  }

  async validatePassword(password) {
    let passwordHash;

    if (!validator.isStrongPassword(password)) {
      throw new Error("Weak password");
    } else {
      return (passwordHash = await PassHash(password));
    }
  }

  validateEmail(email) {
    if (!validator.isEmail(email) || !email) {
      throw new Error("Invalid Email");
    }
    return true;
  }

  validateName(name, error = "Invalid name") {
    if (!name || validator.trim(name) === "") {
      throw new Error(error);
    }
    return true;
  }

  validateAge(age) {
    if (age <= 13 || isNaN(age)) {
      throw new Error("Invalid age");
    }
    return true;
  }

  validateUser(user) {
    if (!user) throw new Error("Invalid user");

    return true;
  }

  validateDevice(device) {
    if (!device || device === undefined) {
      throw new Error("Invalid device");
    }
  }

  imageDelete(profileImagePath) {
    if (profileImagePath) {
      fs.unlinkSync(profileImagePath);
    }
  }
}

export default new GeneralValidations();
