
export const htmlMailTemplate = (port: any, email: string, telegramId: string) => `
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400&family=Nunito:wght@200;300;400;500;600&display=swap');
        body {
          font-family: sans-serif;
          font-size: 13px;
          background-color: #f4f4f4;
        }
        .container {
          margin: 20px auto;
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
        }
        .otp {
          display: inline-block;
          padding: 10px;
          border-radius: 5px;
          background-color: #ddd;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          font-family: 'Inconsolata', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          cursor: pointer;
        }
        p{
            color: #333333;
            font-size: 13px;
            display: block
        }
      </style>
    </head>
    <body>
      <div class="container" style="background-color: #f2f2f2; padding: 20px;display:block">
      <h2 style="color: #333333;text-transform:capitalize">Dear buidlAfrica user,</h2>
      <p style="color: #333333;">Email verification.</p>
      <p style="color: #333333;">Please click on link below to verify our email:</p>
        <div class="otp"><a href="http://localhost:${port}/api/email_verification?telegramId=${telegramId}&email=${email}">verify</a></div>
        <p>If you did not request this code, please ignore this email.</p>
        <p style="color: #333333;">Thank you for choosing BuidlAfrica.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">BuidlAfrica</p>
      </div>
    </body>
  </html>
`;