import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQRCode = async (requestId, user, event) => {
  try {
    const qrData = JSON.stringify({
      name: user.name,
      email: user.email,
      event: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
    });

    const qrDir = path.join(__dirname, "../../../qr_codes");
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const qrCodePath = path.join(qrDir, `qr_${requestId}.png`);
    await QRCode.toFile(qrCodePath, qrData);

    return qrCodePath;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw new Error("Failed to generate QR code: " + error.message);
  }
};