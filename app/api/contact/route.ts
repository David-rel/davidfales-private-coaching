import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #059669; border-radius: 10px;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #047857;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #047857;">Email:</strong> <a href="mailto:${email}" style="color: #059669;">${email}</a></p>
            ${
              phone
                ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Phone:</strong> ${phone}</p>`
                : ""
            }
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #059669; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #047857;">Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #d1d5db; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
            This email was sent from your private coaching website contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}

Message:
${message}

---
This email was sent from your private coaching website contact form.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
