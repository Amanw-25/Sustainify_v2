import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isMember: { type: Boolean, default: false },
  membershipType: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  carbonFootprint:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'CarbonFootprint'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;