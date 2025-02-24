import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDFTicket = async (requestId, user, event, qrCodePath) => {
  return new Promise((resolve, reject) => {
    try {
      const ticketsDir = path.join(__dirname, "../../../tickets");
      if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir, { recursive: true });
      }

      const ticketPath = path.join(ticketsDir, `ticket_${requestId}.pdf`);
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Event Ticket - ${event.name}`,
          Author: 'Sustainify'
        }
      });

      const stream = fs.createWriteStream(ticketPath);
      stream.on("error", (error) => {
        reject(new Error("Failed to write PDF ticket: " + error.message));
      });

      doc.pipe(stream);

      // Add large transparent watermark
      const addWatermark = () => {
        doc.save();
        doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] });
    
        doc.fontSize(120) // Large font size
           .fillColor('#90EE90')  // Light green color
           .fillOpacity(0.20)  // 12% opacity
           .text('SUSTAINIFY', -100, doc.page.height / 2, { 
              align: 'center',
              width: doc.page.width + 200  // Wider text
           });
    
        doc.restore();
    };
    

      addWatermark();

      // Rest of the code remains the same...
      doc.rect(0, 0, doc.page.width, 120)
         .fill('#4CAF50');

      doc.font('Helvetica-Bold')
         .fontSize(28)
         .fillColor('#FFFFFF')
         .text('Event E-Ticket', 50, 45, { align: 'center' });

      doc.font('Helvetica')
         .fontSize(18)
         .fillColor('#333333')
         .text(`Hello, ${user.name}!`, 50, 150, { align: 'center' })
         .fontSize(16)
         .text('You have been approved for the event:', { align: 'center' });

      const boxTop = 230;
      doc.rect(50, boxTop, doc.page.width - 100, 150)
         .lineWidth(1)
         .stroke('#4CAF50');

      doc.fontSize(14)
         .fillColor('#1B5E20')
         .text('Event Details', 70, boxTop + 20, { bold: true });

      doc.fillColor('#333333')
         .fontSize(12)
         .text(`Event Name: ${event.name}`, 70, boxTop + 45)
         .text(`Date: ${new Date(event.date).toLocaleDateString()}`, 70, boxTop + 70)
         .text(`Time: ${event.time}`, 70, boxTop + 95)
         .text(`Location: ${event.location}`, 70, boxTop + 120);

      doc.fontSize(14)
         .fillColor('#1B5E20')
         .text('Scan QR Code for Entry', 50, 420, { align: 'center' });

      if (!fs.existsSync(qrCodePath)) {
        throw new Error("QR code file not found");
      }

      doc.image(qrCodePath, {
        fit: [150, 150],
        x: (doc.page.width - 150) / 2,
        y: 450
      });

      doc.fontSize(10)
         .fillColor('#666666')
         .text('Powered by Sustainify', 50, doc.page.height - 50, {
           align: 'center',
           width: doc.page.width - 100
         });

      doc.end();
      stream.on("finish", () => resolve(ticketPath));
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(new Error("Failed to generate PDF ticket: " + error.message));
    }
  });
};