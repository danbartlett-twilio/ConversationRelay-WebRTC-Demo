import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB

/**
 *  checkDeliveryTime
 * 
 * Simple sample function for tool call
 */
   

export async function CheckRestaurantDeliveryTime(tool) {

    console.info("in CheckRestaurantDeliveryTime and tool\n" + JSON.stringify(tool, null, 2));    

    let input = tool.input;    

    console.info("input\n" + JSON.stringify(input, null, 2));     

    let deliveryTimes = [
        {time: "45 minutes", message:"We are starting your order right now and can have it to you in 45."},
        {time: "1 hour", message:"We will deliver your order in one hour."},
        {time: "1 hour and 15 minutes", message:"We are a little backed up right now so we will delivery your order in one hour and 15 minutes."}
    ];

    let deliveryTime = deliveryTimes[ ( Math.floor (Math.random() * deliveryTimes.length) ) ];
  
    console.log(`[checkDeliveryTime] successfully run.`);

    let toolResult = { deliveryTime: deliveryTime.time, message: deliveryTime.message };

    await saveToolResult(tool, toolResult);

    return true;

}

/**
 *  checkDeliveryTime
 * 
 * Simple sample function for tool call
 */
   

// Function to schedule a tour
export async function CheckRestaurantPickUpTime(tool) {

    console.info("in CheckRestaurantPickUpTime and tool\n" + JSON.stringify(tool, null, 2));    
    
    let input = tool.input;

    console.info("input\n" + JSON.stringify(input, null, 2));     

    let pickupTimes = [
        {time: "15 minutes", message:"We are starting your order right now! See you in 15 minutes."},
        {time: "30 minutes", message:"We will have your order ready in 30 minutes."},
        {time: "45 minutes", message:"We are a little backed up right now so you order will be ready in 45 minutes."}
      ];
    
      let pickupTime = pickupTimes[ ( Math.floor (Math.random() * pickupTimes.length) ) ];
    
      // Return confirmation message for the successful scheduling

    console.log(`[CheckPickUptime] successfully run.`);

    let toolResult = { pickupTime: pickupTime.time, message: pickupTime.message };

    console.info("in CheckRestaurantPickUpTime and toolResult\n" + JSON.stringify(toolResult, null, 2));    

    await saveToolResult(tool, toolResult);

    return true;

}

/**
 * makeFunctionCalls
 * 
 */


// Functions are called dynamically but ONLY if they match a function
// in this object.
const FunctionHandler = {
    PlaceOrderFunction,
    CheckRestaurantPickUpTime,
    CheckRestaurantDeliveryTime        
};

export async function makeFunctionCalls(tool_calls_object, callSid, sessionDetails) {

  try {
    const tool_calls = Object.values(tool_calls_object).map(tool => {                
        return {             
            ...tool, 
            callSid: callSid, 
            userContext: sessionDetails.userContext,
            call_details: {
                to_phone: sessionDetails.To,
                from_phone: sessionDetails.From,
                twilio_call_sid: sessionDetails.CallSid,
                twilio_account_sid: sessionDetails.AccountSid                            
            }
        };                                                
    });          

    await Promise.all(tool_calls.map(async (tool) => {
      try {

        console.log("tool in promise all => ", tool);
        await FunctionHandler[tool.function.name](tool);
      } catch (error) {
        console.error(`Error calling function ${tool.name}: `, error);
        throw new Error(`Error calling function ${tool.name}: ` + error.message);
      }
    }));
    
    return true;
  } catch (error) {
    console.error("Error in makeFunctionCalls: ", error);
    throw new Error('Error in makeFunctionCalls: ' + error.message);
  }
}

async function saveToolResult(tool, toolResult) {

  console.log("in saveToolResult and tool\n" + JSON.stringify(tool, null, 2));
  console.log("in saveToolResult and toolResult\n" + JSON.stringify(toolResult, null, 2));

  let finalToolResult = { 
    role: "tool", 
    tool_call_id: tool.id,
    content: JSON.stringify(toolResult)
  };        

/*
    let finalToolResult = { 
      role: "tool",
      tool_call_id: tool.id, 
      content: [
        {
          toolResult: {
            toolUseId: tool.toolUseId,
            content: [
              {
                "json": toolResult            
              }
            ]
          }
        }
      ]
    };        */
  
    console.info("in saveToolResult and finalToolResult\n" + JSON.stringify(finalToolResult, null, 2));      

    const sessionChats = new FSDB(`../data/sessions/${tool.callSid}/chats.json`, false);
    sessionChats.set(`chat::${Date.now().toString()}${tool.callSid.slice(-5)}`, finalToolResult);

    return true;
  
  }


/**
 *  PlaceOrderFunction
 * 
 * Simple sample function for tool call
 */

// Function to schedule a tour
export async function PlaceOrderFunction(tool) {

  console.info("in PlaceOrderFunction and tool\n" + JSON.stringify(tool, null, 2));    
  
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
  sessionOrder.set(`order::${Date.now().toString()}`, confirmedOrder);
  console.log(`[PlaceOrderFunction] Order successfully saved.`);

  let toolResult = { message: `Your order has been accepted.`};

  await saveToolResult(tool, toolResult);

  return true;
}