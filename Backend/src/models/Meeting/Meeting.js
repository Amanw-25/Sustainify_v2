import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date },
  isHost: { type: Boolean, default: false }, // Identify the host
});

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true }, // Unique meeting ID
  topic: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'ongoing', 'ended'], default: 'pending' },
  startTime: { type: Date },
  endTime: { type: Date },
  participants: [participantSchema], // List of participants
  createdAt: { type: Date, default: Date.now },
});

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
