import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema;

const AdminSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  age: Number,
  role: {
    type: String,
    enum: ["Recruiter", "Manager"],
    required: true,
  },
});

const adminType = ["Recruiter", "Manager"];

const Admin = mongoose.model("admin", AdminSchema);

export {Admin, adminType};
