import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Konfirmasi Email",
        html: `
        <!DOCTYPE html>
<html>
<head>
  <title>Konfirmasi Email</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #ddd; padding: 40px;">
    <tr>
      <td align="center">
        <img src="http://localhost:3000/logo.png" alt="Logo Perusahaan" width="150">
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <h2 style="color: #333;">Selamat Datang di Barbershop!</h2>
        <p style="line-height: 1.6;">
          Terima kasih telah mendaftar. Untuk menyelesaikan pendaftaran Anda, silahkan klik tombol di bawah ini untuk mengkonfirmasi alamat email Anda:
        </p>
        <table align="center" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${confirmLink}" style="background-color: #007bff; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Konfirmasi Email</a>
            </td>
          </tr>
        </table>
        <p style="line-height: 1.6;">
          Jika Anda tidak melakukan pendaftaran, Anda dapat mengabaikan email ini.
        </p>
        <p style="line-height: 1.6;">
          Hormat kami,<br>
          Barbershop
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
}

export async function sendForgotPasswordEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset Password",
        html: `
        <!DOCTYPE html>
<html>
<head>
  <title>Reset Password</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #ddd; padding: 40px;">
    <tr>
      <td align="center">
        <img src="http://localhost:3000/logo.png" alt="Logo Perusahaan" width="150">
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <h2 style="color: #333;">Selamat Datang di Barbershop!</h2>
        <p style="line-height: 1.6;">
         Email ini dikirimkan karena ada permintaan untuk mengatur ulang kata sandi Anda. Silahkan klik tombol di bawah ini untuk mengatur ulang kata sandi Anda:
        </p>
        <table align="center" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${resetLink}" style="background-color: #007bff; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
            </td>
          </tr>
        </table>
        <p style="line-height: 1.6;">
          Jika Anda tidak melakukan permintaan untuk mengatur ulang kata sandi, Anda dapat mengabaikan email ini.
        </p>
        <p style="line-height: 1.6;">
          Hormat kami,<br>
          Barbershop
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
}
