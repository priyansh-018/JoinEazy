const nodemailer = require('nodemailer');
const db = require('../db/db');

const TARGET_RECIPIENT_EMAIL = process.env.SUPPORT_RECIPIENT_EMAIL || 'priyansh191882@gmail.com';

const sendSupportMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    const cleanSubject = (subject && subject.trim()) || 'General Inquiry';

    // 1. Persist to database so message is permanently preserved
    const ticketRes = await db.query(
      `INSERT INTO support_tickets (name, email, subject, message, recipient_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [name.trim(), email.trim(), cleanSubject, message.trim(), TARGET_RECIPIENT_EMAIL]
    );

    const ticketId = ticketRes.rows[0]?.id;

    console.log(`[Support Ticket #${ticketId}] New support request from ${name} (${email}) for recipient: ${TARGET_RECIPIENT_EMAIL}`);

    // 2. If SMTP environment variables are configured, send direct email via nodemailer
    let emailDispatched = false;
    let emailError = null;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"JoinEazy Support Bot" <${process.env.SMTP_USER}>`,
          to: TARGET_RECIPIENT_EMAIL,
          replyTo: email.trim(),
          subject: `[JoinEazy Help Ticket #${ticketId}] ${cleanSubject} - from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #4f46e5; margin-top: 0;">JoinEazy Support & Help Notification</h2>
              <p style="color: #475569; font-size: 14px;">A user submitted an inquiry through the JoinEazy Help / Contact modal:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #1e293b; width: 120px;">Sender Name:</td>
                  <td style="padding: 8px; color: #334155;">${name}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px; font-weight: bold; color: #1e293b;">Sender Email:</td>
                  <td style="padding: 8px; color: #334155;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; color: #1e293b;">Subject/Topic:</td>
                  <td style="padding: 8px; color: #334155;">${cleanSubject}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 8px; font-weight: bold; color: #1e293b;">Target Inbox:</td>
                  <td style="padding: 8px; color: #334155;">${TARGET_RECIPIENT_EMAIL}</td>
                </tr>
              </table>

              <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #1e293b; font-size: 13px;">Message Content:</p>
                <p style="margin: 0; color: #334155; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${message}</p>
              </div>

              <div style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                Ticket #${ticketId} &bull; JoinEazy Academic Management Platform
              </div>
            </div>
          `
        });

        emailDispatched = true;
        console.log(`[Support Ticket #${ticketId}] Email successfully dispatched to ${TARGET_RECIPIENT_EMAIL}`);
      } catch (err) {
        emailError = err.message;
        console.warn(`[Support Ticket #${ticketId}] SMTP delivery note (will use browser mail client fallback):`, err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Your message has been received and routed to ${TARGET_RECIPIENT_EMAIL}`,
      ticket_id: ticketId,
      recipient: TARGET_RECIPIENT_EMAIL,
      email_dispatched: emailDispatched,
      email_note: emailError
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendSupportMessage,
  TARGET_RECIPIENT_EMAIL
};
