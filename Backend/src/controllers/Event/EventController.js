import { EventDetails } from "../../models/index.js";
import cloudinary from "../../config/cloudinaryConfig.js";

export const addEvent = async (req, res) => {
  const { name, description, date, location, time, type, host, agenda, prizes, keyTakeaways, specialNotes } = req.body;
  const id = req.userId;

  try {
    if (!name || !description || !date || !location || !time || !type || !host) {
      return res.status(400).json({ message: "Missing required fields" });
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
                { folder: "events", public_id: `event_${Date.now()}_${index}` },
                (error, result) => {
                  if (error) reject(error);
                  else resolve({ url: result.secure_url });
                }
              )
              .end(file.buffer);
          })
      );

      try {
        const uploadedImages = await Promise.all(uploadPromises);
        finalImage = uploadedImages.length > 0 ? uploadedImages[0].url : DEFAULT_IMAGE;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const newEvent = new EventDetails({
      name,
      description,
      date,
      time,
      location,
      type,
      host,
      image: finalImage || DEFAULT_IMAGE,
      organizer: id,
      agenda: agenda ? agenda : [],
      prizes: prizes ? prizes : [],
      keyTakeaways: keyTakeaways ? keyTakeaways: [],
      specialNotes,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.log("Error creating event:", error);
    res.status(409).json({ message: error.message, error: "Event creation failed" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await EventDetails.find().populate("organizer", "name email profilePhoto");
    res.status(200).json({ message: "Events fetched successfully", events });
  } catch (error) {
    res.status(404).json({ message: error.message, error: "Events not found" });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await EventDetails.findById(id).populate("organizer", "name email profilePhoto");
    if (!event) throw new Error("Event not found");

    res.status(200).json({ message: "Event fetched successfully", event });
  } catch (error) {
    res.status(404).json({ message: error.message, error: "Event not found" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, date, location, time, type, host, agenda, prizes, keyTakeaways, specialNotes } = req.body;
  const userId = req.userId;

  try {
    const event = await EventDetails.findById(id);
    if (!event) throw new Error("Event not found");

    if (event.organizer.toString() !== userId) {
      throw new Error("Unauthorized to update this event");
    }

    let image = event.image;

    if (req.files && req.files.length > 0) {
      if (event.image) {
        const publicId = event.image.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      }

      const uploadResults = await Promise.all(
        req.files.map(
          (file, index) =>
            new Promise((resolve, reject) => {
              cloudinary.v2.uploader
                .upload_stream(
                  {
                    folder: "events",
                    public_id: `events_${Date.now()}_${index}`,
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
        )
      );

      if (uploadResults.length > 0) {
        image = uploadResults[0].url;
      }
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.time = time || event.time;
    event.type = type || event.type;
    event.host = host || event.host;
    event.agenda = agenda ? JSON.parse(agenda) : event.agenda;
    event.prizes = prizes ? JSON.parse(prizes) : event.prizes;
    event.keyTakeaways = keyTakeaways ? JSON.parse(keyTakeaways) : event.keyTakeaways;
    event.specialNotes = specialNotes || event.specialNotes;
    event.image = image; 
    event.updatedAt = Date.now(); 

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ message: error.message || "Error updating event" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const event = await EventDetails.findById(id);
    if (!event) throw new Error("Event not found");
    if (event.organizer.toString() !== userId) throw new Error("Unauthorized to delete this event");

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message, error: "Event not found" });
  }
};
