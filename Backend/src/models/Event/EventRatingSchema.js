const mongoose = require('mongoose');

const eventRatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventDetails', required: true },
  comments : { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

const EventRating = mongoose.model('EventRating', eventRatingSchema);
export default EventRating;