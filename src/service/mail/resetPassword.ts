export const resetPasswordMail = (userName: string, resetLink: string, year: number) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password - ExamForge</title>
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
                We received a request to reset the password for your <strong>ExamForge</strong> account.
              </p>

              <p>
                Click the button below to set a new password:
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href=${resetLink} 
                       style="background-color:#4F46E5; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:5px; display:inline-block; font-weight:bold;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p>
                This link will expire in <strong>1 hour</strong> for security reasons.
              </p>

              <p>
                If the button above does not work, copy and paste the link below into your browser:
              </p>

              <p style="word-break: break-all;">
                <a href=${resetLink} style="color:#4F46E5;">
                  ${resetLink}
                </a>
              </p>

              <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;">

              <p style="font-size:14px; color:#666666;">
                <strong>Security Notice:</strong> If you did not request a password reset, you can safely ignore this email. Your account remains secure and no changes have been made.
              </p>

              <p style="margin-top:20px; font-size:14px; color:#666666;">
                For your protection, never share this link with anyone.
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