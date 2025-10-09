import crypto from 'crypto'

let a = crypto.randomBytes(42);

console.log(a.toString('base64'))