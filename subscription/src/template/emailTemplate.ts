// emailService.ts

import * as nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { GOOGLE_EMAIL, GOOGLE_PASS, SENDGRID_API_KEY, SENDER_EMAIL } from "../config";

interface EmailOptions {
  toUser: string;
  subject: string;
  templateVariables: { [key: string]: string };
}

export function sendEmail(options: EmailOptions): void {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: GOOGLE_EMAIL,
      pass: GOOGLE_PASS,
    },
  });

  const mailOptions = {
    to: options.toUser,
    // from: SENDER_EMAIL || "",
    from: GOOGLE_EMAIL || '',
    subject: options.subject,
    html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${options.subject}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #666;
                }
                .action {
                    font-size: 24px;
                    font-weight: bold;
                    color: #0078d4;
                }
                .highlight {
                    background-color: #f7c44d;
                    padding: 5px;
                    border-radius: 5px;
                    font-weight: bold;
                }
                .contact {
                    color: #0078d4;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${options.templateVariables.action}</h1>
               
                <p class="action"><span class="highlight">${options.templateVariables.action}</span></p>
                
                <p>Best regards,</p>
                <p>RentWorthy team<p>
            </div>
        </body>
        </html>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email sending failed:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  //send email with sendGrid
  //   sgMail.setApiKey(SENDGRID_API_KEY || "");

  //   sgMail
  //     .send(mailOptions)
  //     .then((response: any) => {
  //       console.log("Email sent:", response[0]);
  //     })
  //     .catch((error: any) => {
  //       console.error("Email sending failed:", error);
  //     });
}
