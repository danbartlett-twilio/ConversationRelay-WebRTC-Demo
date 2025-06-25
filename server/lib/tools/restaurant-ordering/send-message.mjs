import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult } from "../save-tool-result.mjs";
import pkg from "../twilio-send-message.cjs";
const { sendMessageWithTwilio } = pkg;

export async function SendSms(tool) {

  console.info("in SendSMS and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  

  const sessionOrders = new FSDB(`../data/sessions/${tool.callSid}/orders.json`, false);
  const sessionOrder= sessionOrders.get('order');

  console.info("sessionOrder\n" + JSON.stringify(sessionOrder, null, 2));  
 
  const order_items_text = sessionOrder.order.order_items.map( it => {
    return  it.line_item;
  });

  // Personalize the message using the userProfile
  const name = tool.userContext?.firstName || "friend";
  const message = `Hi ${name}, Twilio Dough Boys has accepted your order [${order_items_text.join(', ')}]. The total is $${sessionOrder.order.order_total} due on ${sessionOrder.order.order_type}.`;

  if (sessionOrder.order.order_type === "delivery" && sessionOrder.order?.delivery_address) {
    message = message + ` This order will be delivered to ${sessionOrder.order?.delivery_address}.`
  }

  let messageObject = {
    To: args.to_phone,
    MessageBody: message
  };

  await sendMessageWithTwilio(messageObject);

  let toolResult = { message: "An order conformation SMS has been sent!" };

  await saveToolResult(tool, toolResult);

  return true;

}