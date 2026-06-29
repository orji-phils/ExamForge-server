"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeMail = void 0;
const welcomeMail = (userName, dashboardLink, year) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to ExamForge</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#4F46E5; color:#ffffff; text-align:center; padding:20px;">
              <h1 style="margin:0; font-size:24px;">ExamForge</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">

              <p>Hello ${userName},</p>

              <p>
                Welcome to <strong>ExamForge</strong>. Your account has been successfully activated.
              </p>

              <p>
                You now have access to a growing collection of past questions and study resources designed to help you prepare effectively and perform at your best.
              </p>

              <p style="margin-top:20px;">
                <strong>Your journey to academic excellence starts now.</strong>
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href=${dashboardLink} 
                       style="background-color:#4F46E5; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
                      Start Practicing
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Quick Start Guide -->
              <div style="margin-top:30px;">
                <p><strong>Quick Start Guide:</strong></p>
                <ol style="padding-left:20px;">
                  <li>Select your level of study</li>
                  <li>Choose a subject</li>
                  <li>Start practicing past questions</li>
                </ol>
              </div>

              <p style="margin-top:20px;">
                Consistent practice is the key to improvement. The more you engage, the more confident and prepared you become.
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;">

              <p style="font-size:14px; color:#666666;">
                If you did not activate this account or believe this was done in error, please contact support immediately.
              </p>

              <p style="margin-top:30px;">
                Regards,<br>
                The ExamForge Team
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f4f4f7; text-align:center; padding:20px; font-size:12px; color:#888888;">
              © ${year} ExamForge. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `;
};
exports.welcomeMail = welcomeMail;
//# sourceMappingURL=welcome.js.map