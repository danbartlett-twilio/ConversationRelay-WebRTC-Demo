import { saveToolResult} from '../save-tool-result.mjs';

async function sendMessage(tool) {

 console.log('Placeholder function for sending SMS confirmation');

  return {
    status: "success",
    message: `An SMS confirmation has been sent.`,
  };
  
}

export async function SendAppointmentConfirmationSmsTool(tool) {

    console.info("EVENT\n" + JSON.stringify(tool, null, 2));    

    
    try {

        let toolResult = await sendMessage(tool);

        await saveToolResult(tool, toolResult);

        return true;

    } catch (error) {
        
        console.log("Error failed to complete the function [SendAppointmentConfirmationSmsFunction] => ", error);
        
        return false;

    }    

};