"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminInviteMail = void 0;
const adminInviteMail = (name, inviteLink) => {
    return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Admin Invitation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600px" style="background: #ffffff; padding: 30px; border-radius: 8px;">
          <tr>
            <td>
              <h2 style="color: #333;">You're Invited, {{name}}!</h2>

              <p>
                You have been invited to join <strong>{{AppName}}</strong> as an <strong>Administrator</strong>.
              </p>

              <p>
                As an Admin, you will be able to:
              </p>

              <ul>
                <li>Manage past questions</li>
                <li>Update exam content</li>
                <li>Oversee platform content quality</li>
              </ul>

              <p>
                Please note that Admin accounts cannot manage other users or administrators.
              </p>

              <p style="margin: 30px 0;">
                <a href="{{inviteLink}}" 
                   style="background-color: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                   Accept Invitation
                </a>
              </p>

              <p>
                This link is secure and will expire in <strong>24hrs</strong>.
              </p>

              <p>
                If you did not expect this invitation, you may safely ignore this email.
              </p>

              <p style="margin-top: 40px;">
                Best regards,<br/>
                The {{AppName}} Team
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
exports.adminInviteMail = adminInviteMail;
//# sourceMappingURL=admin.mail.js.map