import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function mailData(formattedData, receiverEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD // Your Gmail password (or app-specific password)
    }
  });

  const mailOptions = {
    from: `SCANX: <${process.env.EMAIL}>`, 
    to: receiverEmail, 
    subject: 'Scan Report: PII Data Detection Results', // Subject line
    text: `We have completed a scan of your project and have the following results:

${formattedData}

Please review this information carefully and take appropriate action to secure any sensitive data.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return `Email sent successfully`;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export default mailData;