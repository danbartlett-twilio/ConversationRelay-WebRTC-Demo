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

  try {
    
    // Format and execute api call to Twilio  
    const messageResponse = await twilioClient.messages.create({
      to: messageObject.To,
      from: process.env.TWILIO_MESSAGE_FROM_NUMBER,
      body: messageObject.MessageBody,
    });       
    console.log("messageResponse => ", messageResponse);

  } catch (error) {

    console.error("Error sending message with Twilio: ", error);
    
    // Just logging the error here and will still return true
    // because this is a demo / poc!
    
  }

  return true;

};

module.exports = {
  sendMessageWithTwilio
};