"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApprovalMail = void 0;
const adminApprovalMail = (userName, dashboardLink, year) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Access Approved - ExamForge</title>
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
                Your request to be upgraded to an <strong>administrator</strong> on <strong>ExamForge</strong> has been <strong>approved</strong>.
              </p>

              <p>
                You now have access to administrative features that allow you to contribute to the platform, including managing and uploading academic resources.
              </p>

              <p style="margin-top:20px;">
                <strong>Please use this access responsibly.</strong> Your role plays an important part in maintaining the quality and reliability of content available to students.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href=${dashboardLink} 
                       style="background-color:#4F46E5; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
                      Go to Admin Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p>
                If you are unsure how to proceed, we recommend starting with uploading verified past questions or reviewing existing content.
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;">

              <p style="font-size:14px; color:#666666;">
                If you did not request this role or believe this was granted in error, please contact support immediately.
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
exports.adminApprovalMail = adminApprovalMail;
//# sourceMappingURL=adminApproval.js.map