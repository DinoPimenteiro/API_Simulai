import AdminRepo from "./src/Repositories/AdminRepo.js";

const coisa = await AdminRepo.getAll();

console.log(coisa)