/** 
 * LLMs expect data in a specific format. This module contains functions to
 * format the data for OpenAI and Bedrock LLMs.
*/
export async function formatLLMMessage(role, content) {
    
    try {    

        let finalMessage = {};
        
        // LLM Providers expect messsage in a different format
        if (process.env.AI_PLATFORM === "invokeOpenAI") {

            finalMessage = { role: role, content: content };

        } else if (process.env.AI_PLATFORM === "invokeBedrock") {
            
            finalMessage = { role: role, content: [ { text: content } ] };

        } else {

            console.error("AI_PLATFORM not set to OpenAI or Bedrock.");
            throw new Error('AI_PLATFORM not set to OpenAI or Bedrock.');

        }        

        console.info("finalMessage in formatLLMMessage => " + JSON.stringify(finalMessage, null, 2));

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

        } else {

            console.error("AI_PLATFORM not set to OpenAI or Bedrock.");
            throw new Error('AI_PLATFORM not set to OpenAI or Bedrock.');

        }                

        return defaultModel;

    } catch (error) {

        console.error("Error formatting message: ", error);
        throw error;

    }
};

/*export async function formatLLMTools(role, content) {
    
    try {    

        let finalMessage = {};
        // OpenAI expects messsage in a different format
        if (process.env.AI_PLATFORM === "invokeOpenAI") {

            finalMessage = { role: role, content: content };

        } else if (process.env.AI_PLATFORM === "invokeBedrock") {
            
            finalMessage = { role: role, content: [ { text: content } ] };

        } else {

            console.error("AI_PLATFORM not set to OpenAI or Bedrock.");
            throw new Error('AI_PLATFORM not set to OpenAI or Bedrock.');

        }        

        return finalMessage;

    } catch (error) {

        console.error("Error formatting message: ", error);
        throw error;

    }
};*/