import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB

export async function saveToolResult(tool, toolResult) {

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
    finalToolResult.timestamp = Date.now();
    const sessionChats = new FSDB(`../data/sessions/${tool.callSid}/chats.json`, false);
    sessionChats.set(`chat::${Date.now().toString()}${tool.callSid.slice(-5)}`, finalToolResult);

    return true;
  
  }