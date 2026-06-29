"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterInviteMail = void 0;
const masterInviteMail = (name, inviteLink) => {
    return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Master Account Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600px" style="background: #ffffff; padding: 30px; border-radius: 8px;">
          <tr>
            <td>
              <h2 style="color: #333;">Master Access Invitation</h2>

              <p>
                Dear {{name}},
              </p>

              <p>
                You have been granted a <strong>Master Account</strong> on <strong>{{AppName}}</strong>.
              </p>

              <p>
                Master accounts have full administrative privileges, including:
              </p>

              <ul>
                <li>Managing all users and administrators</li>
                <li>Managing past questions and exam content</li>
                <li>Platform-wide configuration control</li>
                <li>Full oversight of system activity</li>
              </ul>

              <p style="margin: 30px 0;">
                <a href="{{inviteLink}}" 
                   style="background-color: #111827; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                   Activate Master Account
                </a>
              </p>

              <p>
                This secure invitation expires in <strong>24hrs</strong>.
              </p>

              <p>
                Due to the elevated privileges of this role, please keep this link confidential.
              </p>

              <p style="margin-top: 40px;">
                Regards,<br/>
                The {{AppName}} Leadership Team
              </p>

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
exports.masterInviteMail = masterInviteMail;
//# sourceMappingURL=master.mail.js.map