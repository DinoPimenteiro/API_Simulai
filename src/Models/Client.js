import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema({
  title: String,
  body: String,
  rating: Number,
  status: {
    type: String,
    enum: ["Aprovado", "Pendente", "Rejeitado"],
    default: "Pendente",
  },
  type: {
    type: String,
    enum: ["Evaluation", "Help"],
  },
  createdAt: Date,
  UpdatedAt: Date,
});

const ClientSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  age: Number,
  profileImage: String,
  resume: String,
  level: {
    type: String,
    enum: ["Begginer", "Intermediate", "Advanced"],
    default: null,
  },
  job: {
    type: String,
    default: null,
  },
  comment: [CommentSchema],
});

const userLevel = ["Begginer", "Intermediate", "Advanced"];
const commentType = ["Help", "Evaluation"];
const commentStatus = ["Aprovado", "Pendente", "Rejeitado"];

const Client = mongoose.model("client", ClientSchema);

export { Client, userLevel, commentType, commentStatus };
