import { userLevel, commentStatus } from "../Models/Client.js";

function ValidLevel(level) {
  if (typeof level === "string" && userLevel.includes(level)) {
    if (level || !level.trim() === "") {
      return true;
    }
  }

  return false;
}

function validComment(type) {
  if (typeof type === "string") {
    if (type == "Help" || type == "Evaluation") {
      return true;
    }
  }
  return false;
}

function validStatus(status) {
  if (typeof status === "string" && commentStatus.includes(status)) {
    if (status || !status.trim() === "") {
      return true;
    }
  }

  return false;
}
export { ValidLevel, validComment, validStatus };
