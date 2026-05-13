import Mailgen from 'mailgen';
import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
      theme : "default",
      product: {
        name : "Task Manager",
        link : "https://taskmanager.com/" 
      }
  })

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_STMP_HOST,
    port: process.env.MAILTRAP_STMP_PORT, 
    auth: {
      user: process.env.MAILTRAP_STMP_USER, 
      pass: process.env.MAILTRAP_STMP_PASS, 
    },
  });

  const mail = {
    from: "mail.Taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHTML
  };

  try {  
  await transporter.sendMail(mail);
  }catch (error) {
    console.error("Email service failed silently. Make sure that you have provided your MAILTRAP credentials in to the .env file ")
  }

}

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
      body: {
        name: username,
        intro: "Welcome to our app! We're very excited to have you on board.",
        action: {
          instructions: "To verify your email click on the following button:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Verify Your Email",
            link: verificationUrl,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We have got a request to reset your password. If you didn't make this request, just ignore this email. Otherwise, you can reset your password using the link below.",
      action: {
        instructions: "To reset your password click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset Your Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
     
  };
};

export { sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent }