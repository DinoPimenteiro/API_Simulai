import transporter from "../config/mailConfig.js";
import { cryptoHash } from "../utils/hashUtils.js";
import crypto from 'crypto';

class mailService {
  async sendEmail(userMail) {
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
      return ({
        sent,
        code
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async recruitEmail(email){
    let tk = crypto.randomBytes(40).toString('hex');
    const hashTk = cryptoHash(tk);
  }
}

export default new mailService();
