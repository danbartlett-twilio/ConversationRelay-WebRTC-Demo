/**
 *  twilio-send-email
 * 
 *
 */

// SendGrid Client (from Lambda Layer)
const mail = require('@sendgrid/mail');   

async function sendEmailWithTwilio(emailObject) {

  console.info("MessageObject\n" + JSON.stringify(emailObject, null, 2));    

    // This could be made dynamic if sending from 
    // multiple SendGrid accounts.
    mail.setApiKey(process.env.TWILIO_SENDGRID_API_KEY);    
    
    // Simple example that could be easily extended to
    // include dynamic templates and add categories, custom arguments
    // an more => https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
    let emailSendObject = {
      to: emailObject.to_email,
      from: process.env.TWILIO_SENDGRID_FROM,
      subject: emailObject.subject,
      content: [{type:"text/html", value:emailObject.html}]
    };

    // Call SendGrid
    let response = await mail.send(emailSendObject);

    console.log("response ==> ", response);

  return true;

};

module.exports = {
  sendEmailWithTwilio
};