import validator from "validator";
import { PassHash } from "./hashUtils.js";

class GeneralValidations {
  async validatePassword(password) {
    let passwordHash;

    if (!validator.isStrongPassword(password)) {
      throw new Error("Weak password");
    } else {
      return passwordHash = await PassHash(password)
    }
  }

  validateEmail(email) {
    if (!validator.isEmail(email) || !email) {
      throw new Error("Invalid Email");
    }
    return true;
  }

  validateName(name) {
    if (!name || name.trim() === "") {
      throw new Error("Invalid name.");
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
    if (!user) {
      throw new Error("Invalid user.");
    }
    return true;
  }
}

export default new GeneralValidations();