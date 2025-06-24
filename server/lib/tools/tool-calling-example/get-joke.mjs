import { returnJoke } from "./tool-calling-example-resources.mjs";
import { saveToolResult } from "../save-tool-result.mjs";

export async function GetJoke(tool) {

  console.info("in GetJoke and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  

  let joke = await returnJoke();
  let toolResult = { message: joke };

  await saveToolResult(tool, toolResult);

  return true;

}