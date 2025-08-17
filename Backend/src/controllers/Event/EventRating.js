import { EventRating } from "../../models/index.js";

export const addEventRating = async (req, res) => {
  const { comments, rating } = req.body;
  const userId = req.userId;
  const {eventId}= req.params;
  try {
    if (!comments || !rating) {
      throw new Error("Please fill all the fields");
    }

    const newEventRating = new EventRating({
      userId,
      eventId,
      comments,
      rating,
    });

    await newEventRating.save();
    res.status(201).json({
      message: "Event rating added successfully",
      newEventRating,
    });
  } catch (error) {
    res.status(409).json({
      message: error.message,
      error: "Event rating failed",
    });
  }
};

export const getEventRating = async (req, res) => {
  const { eventId } = req.params; 

  try {
    const eventRating = await EventRating.find({ eventId }).populate({
      path: "userId",
      select: "name profilePhoto",
    });
    if (!eventRating || eventRating.length === 0) {
      throw new Error("Event rating not found");
    }

    res.status(200).json({
      message: "Event rating fetched successfully",
      eventRating,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      error: "Event rating not found",
    });
  }
};


export const updateEventRating = async (req, res) => {
  const { comments, rating } = req.body;
  const userId = req.userId;
  const { eventId } = req.params;

  try {
    if (!comments || !rating) {
      throw new Error("Please fill all the fields");
    }

    const eventRating = await EventRating.findOne({ userId, eventId });
    if (!eventRating) {
      throw new Error("Event rating not found");
    }

    eventRating.comments = comments;
    eventRating.rating = rating;
    await eventRating.save();

    res.status(200).json({
      message: "Event rating updated successfully",
      eventRating,
    });
  } catch (error) {
    res.status(409).json({
      message: error.message,
      error: "Event rating update failed",
    });
  }
};
