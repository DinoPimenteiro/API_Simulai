import transporter from "../config/mailConfig.js";
import RfshTokenRepo from "../Repositories/RfshTokenRepo.js";
import ClientRepo from "../Repositories/ClientRepo.js";
import validator from 'validator';
import { encryptToken } from "../utils/hashUtils.js";
import crypto from "crypto";

const ROUTE = "/admin/invite";

class mailService {
  async sendEmail(userMail) {

    if(!validator.isEmail(userMail)){
      throw new Error('Invalid email format.')
    }

    const user = await ClientRepo.findEmail(userMail);

    if(!user){
      throw new Error('User was not found')
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    const body = {
      from: process.env.CLIENT_ID,
      to: userMail,
      subject: "Recuperação de acesso- SIMULAI",
      html: `<h1> SIMULAI </h1> \n <h3> código para recuperação de acesso: ${code} </h3>`,
      text: `Código de recuperação para senha SIMULAI: ${code}`,
    };

    try {
      const sent = await transporter.sendMail(body);
      return {
        sent,
        code,
        user,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async recruitEmail(email) {
    const tk = crypto.randomUUID();
    const hashedToken = encryptToken(tk);

    const link = `${process.env.APP_URL}${ROUTE}/${tk}`;

    const body = {
      from: process.env.CLIENT_ID,
      to: email,
      subject: "Convite para a equipe de desenvolvimento SIMULAI",
      html: `<h4> Clique neste link para realizar seu cadastro: ${link} </h4>`,
      text: `Clique neste link para realizar seu cadastro: ${link}`,
    };

    try {
      const savedTk = await RfshTokenRepo.saveToken({
        userEmail: email,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 1000),
      });

      const sent = await transporter.sendMail(body);

      if (sent) {
        return {
          savedTk,
          sent,
          tk,
        };
      }
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  }
}

export default new mailService();
