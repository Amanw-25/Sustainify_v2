import mongoose from 'mongoose';

const eventDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  host:{ type: String},
  agenda: [{ type: String }], 
  prizes: [{ type: String }], 
  keyTakeaways: [{ type: String }], 
  specialNotes: { type: String }, 

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const EventDetails = mongoose.model('EventDetails', eventDetailsSchema);
export default EventDetails;
