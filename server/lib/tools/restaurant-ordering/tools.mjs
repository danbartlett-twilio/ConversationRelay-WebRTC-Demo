import { PlaceOrder } from './place-order.mjs';
import { CheckRestaurantPickUpTime } from './check-restaurant-pick-up-time.mjs';
import { CheckRestaurantDeliveryTime } from './check-restaurant-delivery-time.mjs';

// Tools are called dynamically but ONLY if they match a function
// in this object.
export const ToolHandler = {
    PlaceOrder,
    CheckRestaurantPickUpTime,
    CheckRestaurantDeliveryTime        
};

export async function makeRestaurantOrderingToolCalls(tool_calls_object, callSid, sessionDetails) {

  console.log("In makeRestaurantOrderingUseCaseToolCalls...");

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
        await ToolHandler[tool.function.name](tool);
      
      } catch (error) {
      
        console.error(`Error calling tool ${tool.name}: `, error);
        throw new Error(`Error calling tool ${tool.name}: ` + error.message);
      
      }

    }));
    
    return true;

  } catch (error) {
    
    console.error("Error in makeRestaurantOrderingToolCalls: ", error);
    throw new Error('Error in makeRestaurantOrderingToolCalls: ' + error.message);

  }
}
