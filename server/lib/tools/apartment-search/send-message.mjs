import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult } from "../save-tool-result.mjs";
import pkg from "../twilio-send-message.cjs";
const { sendMessageWithTwilio } = pkg;

export async function SendSms(tool) {

  console.info("in SendSMS and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  
  
  // Personalize the message using the userProfile
  const name = tool.userContext?.firstName || "friend";
  const apartmentType = args.appointmentDetails.apartmentType;
  const tourType = args.appointmentDetails.type === "in-person" ? "an in-person" : "a self-guided";
  const message = `Hi ${name}, your tour for a ${apartmentType} apartment at Parkview is confirmed for ${args.appointmentDetails.date} at ${args.appointmentDetails.time}. This will be ${tourType} tour. We'll be ready for your visit! Let us know if you have any questions.`;

  let messageObject = {
    To: args.to_phone,
    MessageBody: message
  };

  await sendMessageWithTwilio(messageObject);

  let toolResult = { message: "An conformation SMS has been sent!" };

  await saveToolResult(tool, toolResult);

  return true;

}