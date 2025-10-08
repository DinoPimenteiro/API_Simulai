import { Admin } from "../Models/Admin.js";

class AdminRepo{
  async findById(id){
    return Admin.findById(id);
  }

  async findByEmail(email){
    return Admin.findOne({email: email});
  }

  async findByCode(code){
    return Admin.findOne({code: code})
  }

  async deleteAdm(id){
    return Admin.findOneAndDelete(id);
  }

  async getAll(){
    return Admin.find().lean();
  }

  async save(data){
    return Admin.create(data);
  }

  async update(id, data){
    return Admin.findByIdAndUpdate(id, data)
  }
}

export default new AdminRepo;