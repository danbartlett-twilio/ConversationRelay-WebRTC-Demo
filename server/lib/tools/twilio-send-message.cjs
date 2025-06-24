/**
 *  twilio-send-message
 * 
 *
 */

const accountSid = process.env.TWILIO_MESSAGE_ACCOUNT_SID;
const authToken = process.env.TWILIO_MESSAGE_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

async function sendMessageWithTwilio(messageObject) {

  console.info("MessageObject\n" + JSON.stringify(messageObject, null, 2));    

  // Format and execute api call to Twilio  
  const messageResponse = await twilioClient.messages.create({
    //to: messageObject.To,
    to: "+19494337060",
    from: process.env.TWILIO_MESSAGE_FROM_NUMBER,
    body: messageObject.MessageBody,
  });       
  console.log("messageResponse => ", messageResponse);

  return true;

};

module.exports = {
  sendMessageWithTwilio
};