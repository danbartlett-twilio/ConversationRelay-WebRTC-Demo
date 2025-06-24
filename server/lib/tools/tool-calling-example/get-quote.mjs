import { returnQuote } from "./tool-calling-example-resources.mjs";
import { saveToolResult } from "../save-tool-result.mjs";

export async function GetQuote(tool) {

  console.info("in GetQuote and tool\n" + JSON.stringify(tool, null, 2));    
  
  let args = JSON.parse(tool.function.arguments);

  console.info("args\n" + JSON.stringify(args, null, 2));  

  const randomQuote = await returnQuote();

  let toolResult = { message: randomQuote };

  await saveToolResult(tool, toolResult);

  return true;

}