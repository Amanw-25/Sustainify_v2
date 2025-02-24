import mongoose from "mongoose";

const userEventsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  registeredEvents: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventDetails",
        required: true,
      },
      registrationDate: { type: Date, default: Date.now },
    },
  ],
  eventComments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "EventRating" },
  ],
  eventRatings: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventRating" }],
});

const UserEvents = mongoose.model("UserEvents", userEventsSchema);
export default UserEvents;