import { returnQuote, returnJoke } from "./tool-calling-example-resources.mjs";
import { saveToolResult } from "../save-tool-result.mjs";
import pkg from "../twilio-send-email.cjs";
const { sendEmailWithTwilio } = pkg;

export async function SendEmail(tool) {

  console.info("in SendSMS and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  

  let htmlContent = "";
  if (args.email_type === 'quote') {
    htmlContent = `<html><body><h1>Quote of the Day</h1><p>${await returnQuote()}</p></body></html>`;
  } else if (args.email_type === 'joke') {
    htmlContent = `<html><body><h1>Joke of the Day</h1><p>${await returnJoke()}</p></body></html>`;
  }    

  await sendEmailWithTwilio({
    to_email: args.to_email,
    html: htmlContent,
    subject: `Here is a ${args.email_type} for you!`
  });

  let toolResult = { message: `Email with a ${args.email_type} has been sent!` };

  await saveToolResult(tool, toolResult);

  return true;

}