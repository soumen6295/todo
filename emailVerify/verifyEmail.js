// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// import handlebars from "handlebars";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const verifyEmail = async (token, email) => {
  // const emailTemplateSource = fs.readFileSync(
  //   path.join(__dirname,"template.hbs"),
  //   "utf-8"
  // );
  // const template = handlebars.compile(emailTemplateSource);
  // const htmlToSend = template({ token });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const mailConfigurations = {
    from: process.env.email,
    to: email,
    subject: "Email Verification",
    // html: htmlToSend,
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:8001/verify/${token} 
           Thanks`
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error);
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};