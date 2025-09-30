/** 
 * LLMs expect data in a specific format. This module contains functions to
 * format the data for OpenAI, Bedrock, Anthropic Claude, and Google Gemini LLMs.
*/
export async function formatLLMMessage(role, content) {
    
    try {    

        let finalMessage = {};
        
        // LLM Providers expect messsage in a different format
        if (process.env.AI_PLATFORM === "invokeOpenAI") {

            finalMessage = { role: role, content: content };

        } else if (process.env.AI_PLATFORM === "invokeBedrock") {
            
            finalMessage = { role: role, content: [ { text: content } ] };

        } else if (process.env.AI_PLATFORM === "invokeAnthropic") {
            
            finalMessage = { role: role, content: content };

        } else {

            console.error("AI_PLATFORM not set to OpenAI, Bedrock, or Anthropic");
            throw new Error('AI_PLATFORM not set to OpenAI, Bedrock, or Anthropic');

        }        

        //console.info("finalMessage in formatLLMMessage => " + JSON.stringify(finalMessage, null, 2));

        return finalMessage;

    } catch (error) {

        console.error("Error formatting message: ", error);
        throw error;

    }
};
export async function returnDefaultModel() {
    
    try {    

        let defaultModel = "";
        
        // LLM Providers expect messsage in a different format
        if (process.env.AI_PLATFORM === "invokeOpenAI") {

            defaultModel = process.env.OPENAI_LLM_MODEL;

        } else if (process.env.AI_PLATFORM === "invokeBedrock") {
            
            defaultModel = process.env.AWS_MODEL_IDENTIFIER;            

        } else if (process.env.AI_PLATFORM === "invokeAnthropic") {
            
            defaultModel = process.env.ANTHROPIC_MODEL;            

        } else if (process.env.AI_PLATFORM === "invokeGemini") {
            
            defaultModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";            

        } else {

            console.error("AI_PLATFORM not set to OpenAI, Bedrock, Anthropic, or Gemini.");
            throw new Error('AI_PLATFORM not set to OpenAI, Bedrock, Anthropic, or Gemini.');

        }                

        return defaultModel;

    } catch (error) {

        console.error("Error formatting message: ", error);
        throw error;

    }
};

export async function formatLLMTools(role, content, llmResult) {
    
    try {    

        let finalMessage = { role: role, content: content };
        
        // If tool_calls are present, format based on AI platform
        if (llmResult && Object.keys(llmResult.tool_calls).length > 0) {
            
            if (process.env.AI_PLATFORM === "invokeOpenAI") {
                
                // OpenAI format: tool_calls array
                finalMessage.tool_calls = Object.values(llmResult.tool_calls);

            } else if (process.env.AI_PLATFORM === "invokeBedrock") {
                
                // Bedrock format: tool_calls array
                finalMessage.tool_calls = Object.values(llmResult.tool_calls);

            } else if (process.env.AI_PLATFORM === "invokeAnthropic") {
                
                // Anthropic format: content array with text + tool_use blocks
                const contentBlocks = [];
                
                if (content && content.trim() !== "") {
                    contentBlocks.push({
                        type: "text",
                        text: content
                    });
                }
                
                if (llmResult.anthropic_tool_uses) {
                    llmResult.anthropic_tool_uses.forEach(toolUse => {
                        contentBlocks.push(toolUse);
                    });
                }
                
                finalMessage.content = contentBlocks;

            } else if (process.env.AI_PLATFORM === "invokeGemini") {
                
                // Gemini format: tool_calls array with standard format
                // We maintain compatibility with the standard format in the invokeGemini module
                finalMessage.tool_calls = Object.values(llmResult.tool_calls);

            } else {

                console.error("AI_PLATFORM not set to OpenAI, Bedrock, Anthropic, or Gemini.");
                throw new Error('AI_PLATFORM not set to OpenAI, Bedrock, Anthropic, or Gemini.');

            }
        }

        return finalMessage;

    } catch (error) {

        console.error("Error formatting tool message: ", error);
        throw error;

    }
};