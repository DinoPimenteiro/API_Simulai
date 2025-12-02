import mongoose from "mongoose";
import { type } from "os";

const { Schema, model } = mongoose;

const CompetenciasSchema = new Schema({
  coerencia: { type: Number, min: 0, max: 10, required: true },
  comunicacao: { type: Number, min: 0, max: 10, required: true },
  clareza: { type: Number, min: 0, max: 10, required: true }
}, { _id: false }); // evita criar um _id interno

const interviewSchema = new Schema(
  {
    session_id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cargo: {
      type: String,
      required: true,
    },
    pdf_data: {
      dados_extraidos: {
        nome: String,
        email: String,
        telefone: String,
        resumo: String,
        habilidades: String,
      },
      texto_completo: String,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["assistant", "system", "user"],
          required: true,
        },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    report: {
      type: String,
    },
    feedback: {
      type: CompetenciasSchema,
    },
  },
  { timestamps: true }
);

const Interview = model("interview", interviewSchema);

export default Interview;
