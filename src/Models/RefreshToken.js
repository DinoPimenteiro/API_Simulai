import mongoose from "mongoose";

const {Schema} = mongoose;
const {ObjectId} = Schema;


const RefreshTokenSchema = new Schema({
  userId: ObjectId,
  userEmail: String,
  device: String,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('refreshToken', RefreshTokenSchema);
