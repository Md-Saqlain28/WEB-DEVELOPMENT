import Mailgen from 'mailgen';

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