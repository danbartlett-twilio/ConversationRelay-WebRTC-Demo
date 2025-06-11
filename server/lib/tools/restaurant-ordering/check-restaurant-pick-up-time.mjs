import { saveToolResult } from "../save-tool-result.mjs";

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