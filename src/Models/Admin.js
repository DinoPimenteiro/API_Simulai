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
    enum: ["Boss", "Manager"],
  },
  secret: {
    type: String,
    required: false,
  }
});

const adminType = ["Boss", "Manager"];

const Admin = mongoose.model("admin", AdminSchema);

export {Admin, adminType};
