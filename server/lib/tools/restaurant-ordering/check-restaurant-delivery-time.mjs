import { saveToolResult} from '../save-tool-result.mjs';

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