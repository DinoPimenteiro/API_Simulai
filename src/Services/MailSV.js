import transporter from "../config/mailConfig.js";

class mailService {
  async sendEmail(userMail) {
    const code = parseInt(Math.random() * 9999);

    const body = {
      from: process.env.CLIENT_ID,
      to: userMail,
      subject: "Recuperação de acesso- SIMULAI",
      html: `<h1> SIMULAI </h1> \n <h3> código para recuperação de acesso: ${code} </h3>`,
      text: "Comi o cu de quem tá lendo",
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
}

export default new mailService();
