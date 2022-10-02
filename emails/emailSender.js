const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_KEY);

const sendEmails = (email, name) => {
  sgMail.send({
    to: email, // Change to your recipient
    from: "eng.mech.hamdan@gmail.com", // Change to your verified sender
    subject: "Thank u for sign with us",
    text: `Hello ${name} and welcome in our website , we wish to enjoy in your journy in our website`,
  });
};

module.exports={sendEmails}