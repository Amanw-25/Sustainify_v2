import { EventDetails, EventRequest } from "../../models/index.js";
import { generatePDFTicket } from "./Ticket/pdfController.js";
import nodemailer from "nodemailer";
import { User } from "../../models/index.js";
import appconfig from "../../config/appConfig.js";
import { generateQRCode } from './Ticket/qrController.js';

export const requestToJoinEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.userId;

  try {
    const event = await EventDetails.findById(eventId);
    if (!event) throw new Error("Event not found");

    const existingRequest = await EventRequest.findOne({ userId, eventId });
    if (existingRequest)
      throw new Error("You have already requested to join this event");

    const userName = await User.findById(userId).select("name");
    const userEmail = await User.findById(userId).select("email");

    const newRequest = new EventRequest({ userId, eventId });
    await newRequest.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appconfig.EMAILJS_USER_ID,
        pass: appconfig.EMAILJS_USER_SECRET,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: appconfig.EMAILJS_USER_ID,
      to: userEmail,
      subject: `Registration Pending to Join Event: ${event.name}`,
      html: `
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
              <h2 style="text-align: center; color: #4CAF50;">Request Submitted Successfully!</h2>
              
              <p style="font-size: 16px; color: #555;">Dear <strong>${
                userName.name
              }</strong>,</p>
              
              <p style="font-size: 16px; color: #555;">Your request to join the event has been submitted successfully and is currently Pending. Here are the details:</p>
              
              <div style="background-color: #e9f5e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="color: #2E7D32;">Event Details:</h3>
                <p><strong>Name:</strong> ${event.name}</p>
                <p><strong>Date:</strong> ${new Date(
                  event.date
                ).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
              </div>
    
              <p style="font-size: 16px; color: #555; margin-top: 20px;">We will notify you once your request has been approved. Stay tuned!</p>
    
              <p style="font-size: 16px; color: #555;">Best regards,<br>The Sustainify Team</p>
    
              <footer style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
                <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@sustainify.com" style="color: #4CAF50;">support@sustainify.com</a>.</p>
                
                <div style="margin-top: 20px;">
                  <a href="https://twitter.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #1DA1F2;">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="https://facebook.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #3b5998;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #0077b5;">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://instagram.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #C13584;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `,
    };

    const emailResponse = await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Request submitted successfully, and email sent to user",
      newRequest,
      emailResponse,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await EventRequest.findById(requestId)
      .populate("userId", "email name")
      .populate("eventId", "name date time location");

    if (!request) throw new Error("Request not found");

    request.status = "Approved";
    await request.save();

    // 1️⃣ Generate QR Code
    const qrCodePath = await generateQRCode(requestId, request.userId, request.eventId);

    // 2️⃣ Generate PDF Ticket
    const ticketPath = await generatePDFTicket(requestId, request.userId, request.eventId, qrCodePath);

    // 3️⃣ Send Email with Attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appconfig.EMAILJS_USER_ID,
        pass: appconfig.EMAILJS_USER_SECRET,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: appconfig.EMAILJS_USER_ID,
      to: request.userId.email,
      subject: `🎉 Event Request Approved: ${request.eventId.name}`,
      html: `
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
              <h2 style="text-align: center; color: #4CAF50;">Event Request Approved!</h2>
              <p style="font-size: 16px; color: #555;">Dear <strong>${
                request.userId.name
              }</strong>,</p>
              
              <p style="font-size: 16px; color: #555;">We are excited to inform you that your request to join the event has been approved. Here are the details of the event:</p>
              
              <div style="background-color: #e9f5e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="color: #2E7D32;">Event Details:</h3>
                <p><strong>Name:</strong> ${request.eventId.name}</p>
                <p><strong>Date:</strong> ${new Date(
                  request.eventId.date
                ).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${request.eventId.time}</p>
                <p><strong>Location:</strong> ${request.eventId.location}</p>
              </div>
    
              <p style="font-size: 16px; color: #555; margin-top: 20px;">We are looking forward to seeing you there and having a great time together!</p>
    
              <p style="font-size: 16px; color: #555;">Best regards,<br>The Sustainify Team</p>
    
              <footer style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
                <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@sustainify.com" style="color: #4CAF50;">support@sustainify.com</a>.</p>
                
                <div style="margin-top: 20px;">
                  <a href="https://twitter.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #1DA1F2;">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="https://facebook.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #3b5998;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #0077b5;">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://instagram.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #C13584;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `ticket_${requestId}.pdf`,
          path: ticketPath,
          contentType: "application/pdf",
        },
      ],
    };

    const emailResponse = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Request approved, ticket generated, and email sent successfully",
      request,
      emailResponse,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await EventRequest.findById(requestId)
      .populate("userId", "email name")
      .populate("eventId", "name date time location");
    if (!request) throw new Error("Request not found");
    request.status = "Rejected";
    await request.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: appconfig.EMAILJS_USER_ID,
        pass: appconfig.EMAILJS_USER_SECRET,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: appconfig.EMAILJS_USER_ID,
      to: request.userId.email,
      subject: `❌ Event Request Rejected: ${request.eventId.name}`,
      html: `
        <html>
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
          </head>
          <body>
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
              <h2 style="text-align: center; color: #F44336;">Event Request Rejected</h2>
              <p style="font-size: 16px; color: #555;">Dear <strong>${request.userId.name}</strong>,</p>
              
              <p style="font-size: 16px; color: #555;">We regret to inform you that your request to join the event has been <strong>rejected</strong>. Below are the details of the event:</p>
              
              <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <h3 style="color: #D32F2F;">Event Details:</h3>
                <p><strong>Name:</strong> ${request.eventId.name}</p>
                <p><strong>Date:</strong> ${new Date(request.eventId.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${request.eventId.time}</p>
                <p><strong>Location:</strong> ${request.eventId.location}</p>
              </div>
      
              <p style="font-size: 16px; color: #555; margin-top: 20px;">We understand this might be disappointing, but we encourage you to stay connected for future events!</p>
      
              <p style="font-size: 16px; color: #555;">Best regards,<br>The Sustainify Team</p>
      
              <footer style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
                <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@sustainify.com" style="color: #4CAF50;">support@sustainify.com</a>.</p>
                
                <div style="margin-top: 20px;">
                  <a href="https://twitter.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #1DA1F2;">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="https://facebook.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #3b5998;">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #0077b5;">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://instagram.com/Sustainify" target="_blank" style="margin: 0 10px; font-size: 24px; color: #C13584;">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `,
    };
    
    const emailResponse = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Request approved and email sent successfully",
      request,
      emailResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: error.message,
    });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await EventRequest.find()
      .populate("userId", "name email")
      .populate("eventId", "name");
    res
      .status(200)
      .json({ message: "Requests fetched successfully", requests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
