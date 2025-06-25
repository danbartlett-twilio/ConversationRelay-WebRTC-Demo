import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult } from "../save-tool-result.mjs";

export async function PlaceOrder(tool) {

  console.info("in PlaceOrderTool and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  
 
  let confirmedOrder = {
    description: 'restaurantOrder', 
    order_id: `restaurantOrder::${tool.callSid.slice(-4)}::${(Math.floor(Date.now() / 1000)).toString()}`,
    order: {
      order_items: args.current_order,
      order_type: args.order_type,
      order_total: args.order_total
    },
    timestamp:  Date.now()
  };
    
  const sessionOrder = new FSDB(`../data/sessions/${tool.callSid}/orders.json`, false);
  sessionOrder.set(`order`, confirmedOrder);
  console.log(`[PlaceOrderFunction] Order successfully saved.`);

  let toolResult = { message: `Your order has been accepted.`};

  await saveToolResult(tool, toolResult);

  return true;

}