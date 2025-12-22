import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      parentName,
      email,
      phone,
      message,
      playerAge,
      mainGoal,
      bestDaysTimes,
      area,
      sessionType,
      notes,
    } = await request.json();

    const resolvedName = (parentName || name || "").toString().trim();
    const resolvedEmail = (email || "").toString().trim();
    const resolvedPhone = (phone || "").toString().trim();
    const resolvedMessage = (message || "").toString().trim();

    // Validate required fields
    if (!resolvedName || !resolvedEmail || !resolvedMessage) {
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

    const extraFieldsHtml = `
      ${
        playerAge
          ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Player age:</strong> ${playerAge}</p>`
          : ""
      }
      ${
        mainGoal
          ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Main goal:</strong> ${mainGoal}</p>`
          : ""
      }
      ${
        bestDaysTimes
          ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Best days/times:</strong> ${bestDaysTimes}</p>`
          : ""
      }
      ${
        area
          ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Area:</strong> ${area}</p>`
          : ""
      }
      ${
        sessionType
          ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Session type:</strong> ${sessionType}</p>`
          : ""
      }
      ${
        notes
          ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Notes:</strong> ${notes}</p>`
          : ""
      }
    `;

    const extraFieldsText = [
      playerAge ? `Player age: ${playerAge}` : "",
      mainGoal ? `Main goal: ${mainGoal}` : "",
      bestDaysTimes ? `Best days/times: ${bestDaysTimes}` : "",
      area ? `Area: ${area}` : "",
      sessionType ? `Session type: ${sessionType}` : "",
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${resolvedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #059669; border-radius: 10px;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #047857;">Name:</strong> ${resolvedName}</p>
            <p style="margin: 10px 0;"><strong style="color: #047857;">Email:</strong> <a href="mailto:${resolvedEmail}" style="color: #059669;">${resolvedEmail}</a></p>
            ${
              resolvedPhone
                ? `<p style="margin: 10px 0;"><strong style="color: #047857;">Phone:</strong> ${phone}</p>`
                : ""
            }
            ${extraFieldsHtml}
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #059669; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #047857;">Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${resolvedMessage}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #d1d5db; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
            This email was sent from your private coaching website contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${resolvedName}
Email: ${resolvedEmail}
${resolvedPhone ? `Phone: ${resolvedPhone}` : ""}
${extraFieldsText ? `\n${extraFieldsText}\n` : ""}

Message:
${resolvedMessage}

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
