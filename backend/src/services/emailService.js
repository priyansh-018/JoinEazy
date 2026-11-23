const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer transporter based on environment variables
 */
function getTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || process.env.SMTP_USER.endsWith('@gmail.com');
    if (isGmail) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
}

/**
 * Send an email invitation directly to a student's inbox
 */
async function sendGroupInvitation({
  to,
  inviterName = 'A peer',
  groupName,
  courseCode,
  courseName,
  joinCode,
  joinUrl
}) {
  const subject = `[JoinEazy] ${inviterName} invited you to join team "${groupName}"`;
  const courseDisplay = courseCode ? `${courseCode} • ${courseName || 'Coursework'}` : (courseName || 'Academic Coursework');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Join Team ${groupName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background: #ffffff; border: 2px solid #1c1917; border-radius: 20px; box-shadow: 6px 6px 0px #1c1917; overflow: hidden; max-width: 560px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="background-color: #1c1917; padding: 24px 32px; text-align: left;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #FAF7F2; display: inline-block;">
                JOINEAZY
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #E11D48; letter-spacing: 1px; margin-left: 10px; text-transform: uppercase;">
                • Student & Team Collaboration
              </span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <p style="font-size: 12px; font-weight: 800; color: #E11D48; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 10px 0;">
                Team Collaboration Invitation
              </p>
              <h1 style="font-size: 26px; font-weight: 800; color: #1c1917; margin: 0 0 16px 0; line-height: 1.25;">
                You're invited to join <span style="color: #E11D48;">${groupName}</span>
              </h1>
              <p style="font-size: 15px; line-height: 1.6; color: #44403c; margin: 0 0 24px 0;">
                Hi there, <strong>${inviterName}</strong> has invited you to join their project group for <strong>${courseDisplay}</strong> on JoinEazy.
              </p>

              <!-- Join Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF7F2; border: 2px solid #1c1917; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #78716c; letter-spacing: 1px;">
                      Your Group Join Code
                    </div>
                    <div style="font-size: 22px; font-weight: 900; font-family: monospace; color: #1c1917; letter-spacing: 2px; margin-top: 4px;">
                      ${joinCode}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="${joinUrl}" style="background-color: #E11D48; color: #ffffff; font-size: 14px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 12px; border: 2px solid #1c1917; box-shadow: 3px 3px 0px #1c1917; display: inline-block;">
                  Accept Invitation & Join Team &rarr;
                </a>
              </div>

              <p style="font-size: 13px; color: #78716c; line-height: 1.5; margin: 20px 0 0 0;">
                <em>If you don't have a JoinEazy account yet, clicking the button above will let you register as a student and will automatically enroll you straight into <strong>${groupName}</strong>!</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #FAF7F2; border-top: 2px solid #e7e5e4; text-align: center; font-size: 12px; color: #a8a29e;">
              JoinEazy Academic Coursework & Student Group Platform • Automated Notification
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `Hi,\n\n${inviterName} has invited you to join their student team "${groupName}" for ${courseDisplay} on JoinEazy.\n\nAccept invitation by clicking the link below:\n${joinUrl}\n\nGroup Join Code: ${joinCode}\n\nIf you don't have an account yet, sign up as a student and you'll be automatically enrolled.\n\nBest,\nJoinEazy Team`;

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[Email Dispatcher - Dry Run / Mock Mode]:`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Join URL: ${joinUrl}`);
    console.log(`  (To deliver live emails to real inboxes, configure SMTP_USER & SMTP_PASS in backend/.env)`);
    return {
      sent: true,
      mode: 'mock',
      message: `Invitation generated and dispatched directly to ${to}.`
    };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"JoinEazy" <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: textContent,
      html: htmlContent
    });

    console.log(`[Email Dispatched Live]: Message ID ${info.messageId} delivered to ${to}`);
    return {
      sent: true,
      mode: 'live',
      messageId: info.messageId,
      message: `Invitation email dispatched directly to ${to}!`
    };
  } catch (error) {
    console.error(`[Email Dispatch Error]:`, error.message);
    return {
      sent: false,
      mode: 'live_failed',
      error: error.message,
      message: `Failed to dispatch email directly: ${error.message}`
    };
  }
}

module.exports = {
  sendGroupInvitation
};
