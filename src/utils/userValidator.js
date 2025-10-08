import { userLevel, commentType, commentStatus } from "../Models/Client.js";

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

function validStatus(status){
  return typeof status === 'string' && commentStatus.includes(status);
}
export { ValidLevel, validComment, validStatus };
