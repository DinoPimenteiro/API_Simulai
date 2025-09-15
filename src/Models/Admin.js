import mongoose from 'mongoose';

const {Schema} = mongoose;
const {ObjectId} = Schema;

const AdminSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  
})