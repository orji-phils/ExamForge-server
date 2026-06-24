export const activationMail = (userName: string, activationLink: string, year: number) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Activate Your ExamForge Account</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f4f7; padding: 20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#4F46E5; color:#ffffff; text-align:center; padding:20px;">
              <h1 style="margin:0; font-size:24px;">ExamForge</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.5;">

              <p>Hello ${userName},</p>

              <p>
                Welcome to <strong>ExamForge</strong> — your platform for mastering exams through structured practice and past questions.
              </p>

              <p>
                To get started, please activate your account by clicking the link below:
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href=${activationLink} 
                       style="background-color:#4F46E5; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
                      Activate Account
                    </a>
                  </td>
                </tr>
              </table>

              <p>
                This link will expire in <strong>24 hours</strong> for security reasons.
              </p>

              <p>
                If the button above does not work, copy and paste the link below into your browser:
              </p>

              <p style="word-break: break-all;">
                <a href=${activationLink} style="color:#4F46E5;">
                  ${activationLink}
                </a>
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;">

              <p style="font-size:14px; color:#666666;">
                <strong>Security Note:</strong> If you did not create an account on ExamForge, you can safely ignore this email. No further action is required.
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
}