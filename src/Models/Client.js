import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema;

const CommentSchema = new Schema({

  rating: Number,
  type: {
    type: String,
    enum: ["Evaluation", "Question"]
  },
  title: String, // Ajuda ou avaliação.
  body: String,
  createdAt: Date,
  UpdatedAt: Date,
})

const ClientSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  age: Number,
  level: {
    type: String,
    enum: ["Begginer", "Intermediate", "Advanced"],
    default: null,
  },
  job: {
    type: String,
    default: null,
  },
  comment: [CommentSchema]
});

const userLevel = ["Begginer", "Intermediate", "Advanced"];
const commentType = ["Question", "Evaluation"];

const Client = mongoose.model("client", ClientSchema);

export {Client, userLevel, commentType};
