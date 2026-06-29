"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterUpgradeMail = void 0;
const masterUpgradeMail = (userName, dashboardLink, year) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Master Access Granted - ExamForge</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#111827; color:#ffffff; text-align:center; padding:20px;">
              <h1 style="margin:0; font-size:24px;">ExamForge</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">

              <p>Hello ${userName},</p>

              <p>
                We would like to inform you that your account on <strong>ExamForge</strong> has been upgraded to a <strong>Master</strong> account.
              </p>

              <p>
                This upgrade was carried out by an existing Master administrator, granting you full access to elevated system controls and administrative authority.
              </p>

              <p style="margin-top:20px;">
                <strong>This role carries significant responsibility.</strong> As a Master user, you are entrusted with overseeing platform integrity, managing administrative users, and ensuring the quality of educational resources.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href=${dashboardLink} 
                       style="background-color:#111827; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
                      Go to Master Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p>
                If you were not expecting this change or believe it was made in error, please contact system support immediately.
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;">

              <p style="font-size:14px; color:#666666;">
                For security purposes, ensure your account credentials remain confidential at all times.
              </p>

              <p style="margin-top:30px;">
                Regards,<br>
                The ExamForge System
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
exports.masterUpgradeMail = masterUpgradeMail;
//# sourceMappingURL=masterUpgrade.js.map