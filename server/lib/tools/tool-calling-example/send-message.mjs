import { returnQuote } from "./tool-calling-example-resources.mjs";
import { saveToolResult } from "../save-tool-result.mjs";
import pkg from "../twilio-send-message.cjs";
const { sendMessageWithTwilio } = pkg;

export async function SendSMS(tool) {

  console.info("in SendSMS and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  

  const randomQuote = await returnQuote();

  let messageObject = {
    To: args.to_phone,
    MessageBody: randomQuote
  };

  await sendMessageWithTwilio(messageObject);

  let toolResult = { message: "SMS with a quote has been sent!" };

  await saveToolResult(tool, toolResult);

  return true;

}