const emailTemplates = {
    verification: (otp) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
                .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 30px; background-color: #f9fafb; }
                .otp { font-size: 32px; font-weight: bold; text-align: center; color: #4f46e5; letter-spacing: 5px; margin: 20px 0; padding: 10px; background: #fff; border: 2px dashed #4f46e5; border-radius: 5px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Email</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for signing up! please use the following OTP code to verify your email address. This code will expire in 10 minutes.</p>
                    <div class="otp">${otp}</div>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Your App. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `,
    resetPassword: (url) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
                .header { background: linear-gradient(135deg, #ef4444, #f43f5e); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 30px; background-color: #f9fafb; text-align: center; }
                .button { display: inline-block; padding: 15px 30px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Reset Your Password</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                    <p>Please click on the button below to reset your password. This link will expire in 10 minutes.</p>
                    <a href="${url}" class="button">Reset Password</a>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Your App. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `,
    welcome: (name) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
                .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 30px; background-color: #f9fafb; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Our App!</h1>
                </div>
                <div class="content">
                    <p>Hello ${name},</p>
                    <p>We're excited to have you on board! Your account has been successfully verified.</p>
                    <p>You can now log in and start exploring all the features we have to offer.</p>
                    <p>If you have any questions, feel free to reply to this email.</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Your App. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `
};

module.exports = emailTemplates;
