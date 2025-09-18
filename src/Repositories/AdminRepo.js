import { Admin } from "../Models/Admin.js";

class AdminRepo{
  async findById(id){
    return Admin.findById(id);
  }

  async findByEmail(email){
    return Admin.find({email: email});
  }

  async getAll(){
    return Admin.find().lean();
  }

  async save(data){
    return Admin.create(data);
  }

  async update(id, data){
    return Admin.updateOne(id, data)
  }
}

export default new AdminRepo;