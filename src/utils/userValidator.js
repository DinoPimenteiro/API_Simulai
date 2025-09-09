import { userLevel, commentType } from "../Models/Client.js";

function ValidLevel(level) {
  if (userLevel.includes(level)) {
    return true;
  }
}

function validComment(type) {
  if (typeof type === 'string') {
    if (type == "Help" || type == "Evaluation") {
      return true;
    }
  }
  return false;
}

export { ValidLevel, validComment };
