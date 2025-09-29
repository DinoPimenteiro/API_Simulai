import mongoose from "mongoose";

const { Schema } = mongoose;

const InviteTokenSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  secret: String,
  qrcode: String,
  role: {
    type: String,
    enum: ["Boss", "Manager"],
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used:{
    type: Boolean,
    default: false
  }
});

InviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const InviteToken = mongoose.model('inviteToken', InviteTokenSchema);

export default InviteToken;
