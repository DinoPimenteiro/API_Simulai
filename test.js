import jwt from 'jsonwebtoken'

const payload = {
  email: "kjads",
  secret: "jhbdaw",
  totpCode: "jhbdaw",
  qrcode: "jhbdaw",
};

const recruitToken = jwt.sign(payload,"coissa", {
  expiresIn: "15m",
});

console.log(recruitToken)