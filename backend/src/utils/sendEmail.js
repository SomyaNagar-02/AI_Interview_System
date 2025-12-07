import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SelectX Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text, // Plain text body
      // html: "<b>Hello world?</b>" // You can add HTML templates later
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // We don't throw error here to prevent crashing the main flow if email fails
  }
};