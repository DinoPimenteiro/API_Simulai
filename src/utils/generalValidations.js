import validator from "validator";

export function validatePassword(password) {
  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak password");
  }
  return true;
}

export function validateEmail(email) {
    if (!validator.isEmail(email) || !email) {
        throw new Error("Invalid Email");
    }
    return true;
}

export function validateName (name) {
    if (!name || name.trim() === "") {
        throw new Error("Invalid name.");
    }
    return true;
}

export function validateAge(age) {
    if (age <= 13 || isNaN(age)) {
        throw new Error("Invalid age");
    }
    return true;
}

export function validateUser(user){
    if (!user) {
        throw new Error("Invalid user.");
    }
    return true;
}