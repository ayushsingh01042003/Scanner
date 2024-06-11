import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

async function mailData(jsonData, receiverEmail){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Your Gmail address
          pass: process.env.EMAIL_PASSWORD // Your Gmail password (or app-specific password)
        }
      });
    
    const mailOptions = {
    from: `Cognizant: <${process.env.EMAIL}>`, // Sender address
    to: receiverEmail, // List of recipients
    subject: 'PII Data Detected in Your GitHub Repository', // Subject line
    text: 'We have identified that your GitHub repository, [Repository Name], contains Personally Identifiable Information (PII). This data exposure can pose significant privacy and security risks.', // Plain text body
    
    };

    try {
        await transporter.sendMail(mailOptions);
        return `Email sent successfully`
      } catch (error) {
        return error;
    }
}


export default mailData;