// This file needs to be imported in lib/default-websocket-handler.mjs
// and added to the switch (sessionDetails.useCase) in that file.

import { GetJoke } from './get-joke.mjs';
import { GetQuote } from './get-quote.mjs';
import { SendSMS } from './send-message.mjs';
import { SendEmail } from './send-email.mjs';
import { GetZip } from './get-zip-code.mjs';

// Tools are called dynamically but ONLY if they match a function
// in this object.
export const ToolHandler = {
    GetJoke,
    GetQuote,
    SendSMS,
    SendEmail,
    GetZip
};

export async function makeToolCallingExampleToolCalls(tool_calls_object, callSid, sessionDetails) {

  console.log("In makeToolCallingExampleToolCalls...");

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
    
    console.error("Error in makeToolCallingExampleToolCalls: ", error);
    throw new Error('Error in makeToolCallingExampleToolCalls: ' + error.message);

  }
}
