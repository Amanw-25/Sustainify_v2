import { CarbonFootprint, Badge } from "../models/index.js";
import { User } from "../models/index.js";
import nodemailer from "nodemailer";
import appconfig from "../config/appConfig.js";

const sendBadgeEmail = async (userEmail, badge) => {
  const mailOptions = {
    from: appconfig.EMAILJS_USER_ID,
    to: userEmail,
    subject: `Congratulations! You've Earned a New Badge: ${badge.name}`,
    html: `
      <html>
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #f1f1f1; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #4CAF50;">Badge Earned Successfully!</h2>
            <p style="font-size: 16px; color: #555;">Congratulations! You've earned a new badge for your efforts. Here are the details:</p>
            <div style="background-color: #e9f5e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="color: #2E7D32;">Badge Details:</h3>
              <p><strong>Badge Name:</strong> ${badge.name}</p>
              <p><strong>Earned Date:</strong> ${new Date(
                badge.earnedDate
              ).toLocaleDateString()}</p>
            </div>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">Keep up the great work! Continue making an impact and keep earning more badges.</p>
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

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: appconfig.EMAILJS_USER_ID,
      pass: appconfig.EMAILJS_USER_SECRET,
    },
  });

  await transporter.sendMail(mailOptions);
};

export const assignBadgesAutomatically = async () => {
  const users = await CarbonFootprint.aggregate([
    { $group: { _id: "$user", carbonData: { $push: "$$ROOT" } } },
    { $sort: { _id: 1 } },
  ]);

  for (let user of users) {
    const userId = user._id;
    const carbonData = user.carbonData;

    const userEmail = await User.findById(userId).select("email");

    const earnedBadges = await evaluateBadgeCriteria(userId, carbonData);

    if (earnedBadges.length > 0) {
      for (let badge of earnedBadges) {
        const existingBadge = await Badge.findOne({
          user: userId,
          name: badge,
        });

        if (!existingBadge) {
          await Badge.findOneAndUpdate(
            { user: userId, name: badge },
            {
              $setOnInsert: {
                name: badge,
                user: userId,
                earnedDate: new Date(),
              },
            },
            { upsert: true }
          );

          await sendBadgeEmail(userEmail, {
            name: badge,
            earnedDate: new Date(),
          });
        }
      }
    }
  }
};

const evaluateBadgeCriteria = async (userId, carbonData) => {
  const earnedBadges = [];

  const latestEntry = carbonData[carbonData.length - 1];
  const firstEntry = carbonData[0];

  const totalReduction =
    ((firstEntry.Total - latestEntry.Total) / firstEntry.Total) * 100;
  if (totalReduction >= 5) {
    earnedBadges.push("Carbon Reducer");
  }

  const lastThreeMonths = carbonData.slice(-3);
  const avgLastThreeMonths =
    lastThreeMonths.reduce((acc, entry) => acc + entry.Total, 0) / 3;
  if (avgLastThreeMonths < 120) {
    earnedBadges.push("Eco Warrior");
  }

  return earnedBadges;
};
