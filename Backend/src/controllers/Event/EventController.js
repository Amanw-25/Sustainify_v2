import { EventDetails } from "../../models/index.js";
import cloudinary from "../../config/cloudinaryConfig.js";

export const addEvent = async (req, res) => {
  const { name, description, date, location, time, type} = req.body;
  const id = req.userId;
  try {

    if (!name){
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!description){
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (!date){
      return res.status(400).json({
        message: "Date is required",
      });
    }

    if (!location){
      return res.status(400).json({
        message: "Location is required",
      });
    }

    if (!time){
      return res.status(400).json({
        message: "Time is required",
      });
    }

    if (!type){
      return res.status(400).json({
        message: "Type is required",
      });
    }


    let finalImage;
    const DEFAULT_IMAGE =
      "https://cdn.pixabay.com/photo/2016/02/16/12/56/events-1203275_1280.jpg";

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file, index) =>
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                {
                  folder: "events",
                  public_id: `event_${Date.now()}_${index}`,
                },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                  } else {
                    resolve({
                      url: result.secure_url,
                      publicId: result.public_id,
                    });
                  }
                }
              )
              .end(file.buffer);
          })
      );

      try {
        const uploadedImages = await Promise.all(uploadPromises);
        if (uploadedImages.length > 0) {
          finalImage = uploadedImages[0].url;
          console.log("Uploaded new image, using:", finalImage);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }

    const newEvent = new EventDetails({
      name,
      description,
      date,
      image: finalImage || DEFAULT_IMAGE,
      location,
      time,
      type,
      organizer: id,
    });
    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    res.status(409).json({
      message: error.message,
      error: "Event creation failed",
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const event = await EventDetails.find().populate(
      "organizer",
      "name email profilePhoto"
    );
    if (!event) {
      throw new Error("No events found");
    }

    res.status(200).json({
      message: "Events fetched successfully",
      event,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      error: "Events not found",
    });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await EventDetails.findById(id).populate(
      "organizer",
      "name email profilePhoto"
    );
    if (!event) {
      throw new Error("Event not found");
    }

    res.status(200).json({
      message: "Event fetched successfully",
      event,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      error: "Event not found",
    });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, date, location, time, type } = req.body;
  const userId = req.userId;

  try {
    const event = await EventDetails.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.organizer.toString() !== userId) {
      throw new Error("You are not authorized to update this event");
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.time = time || event.time;
    event.type = type || event.type;
    event.updatedAt = Date.now();

    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      error: "Event not found",
    });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const event = await EventDetails.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.organizer.toString() !== userId) {
      throw new Error("You are not authorized to delete this event");
    }

    await event.delete();

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
      error: "Event not found",
    });
  }
};
