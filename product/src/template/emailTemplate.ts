// emailService.ts

import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { GOOGLE_EMAIL, GOOGLE_PASS } from '../config';

interface EmailOptions {
    toUser: string;
    subject: string;
    templateVariables: { [key: string]: string };
}

export function sendEmail(options: EmailOptions): void {
    console.log(GOOGLE_EMAIL, GOOGLE_PASS);
    
    // Read the HTML email template from the file
    // const emailTemplate = fs.readFileSync("", 'utf-8');

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail'
        auth: {
            user: GOOGLE_EMAIL,
            pass: GOOGLE_PASS
        }
    });

    // Define the email content with template variables
    const mailOptions = {
        from: GOOGLE_EMAIL,
        to: options.toUser,
        subject: options.subject,
        html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Your OTP</title>
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
                .otp {
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
                <h1>Your One-Time Password (OTP)</h1>
                <p>We hope this message finds you well. Your security is important to us, and we are committed to ensuring that your online experience is both convenient and safe.</p>
                
                <p>To proceed with your request, we have generated a One-Time Password (OTP) for you. Please find your OTP details below:</p>
                <p class="otp">Your OTP: <span class="highlight">${options.templateVariables.otp}</span></p>
                
                <p>This OTP is valid for a single use and will expire in <span class="highlight">24 hours</span>. Please do not share this OTP with anyone, as it is a critical component of your account security.</p>
                
                <p>If you did not initiate this request, or if you have any concerns regarding the security of your account, please contact our support team immediately at <a href="mailto:[Customer Support Email]" class="contact">[Customer Support Email]</a> or <span class="contact">[Customer Support Phone Number]</span>.</p>
                
                <p>Thank you for choosing <span class="highlight">RentWorthy</span> for your <span class="highlight">Rent <b>•</b> Lead <b>•</b> Enjoy</span>. We appreciate your trust in us, and we are here to assist you with any questions or concerns you may have.</p>
                
                <p>Best regards,</p>
                <p>RentWorthy team<p>
            </div>
        </body>
        </html>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
