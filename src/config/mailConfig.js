import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CLIENT_ID,
    pass: process.env.CLIENT_SECRET,
  },
});

export default transporter;