/**
 * invoke-bedrock.mjs
 * 
 * This module formats the prompt, invokes bedrock, handles and 
 * formats the streamed response, and returns a results object.
 * 
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-bedrock-runtime/Interface/ConverseStreamCommandInput/
 * 
 */
import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
const bedrockClient = new BedrockRuntimeClient();

export async function invokeBedrock(promptObj) {

    try {
        //console.info("in [ invokeBedrock ] and promptObj ==> \n" + JSON.stringify(promptObj, null, 2));     

        // Use the Bedrock ConverseStreamCommand to call the LLM        

        let tools = (promptObj.sessionDetails.tools) ? JSON.parse(promptObj.sessionDetails.tools) : [];

        const bedrockInput = {            
            modelId: promptObj.sessionDetails.llmModel, // Set as env var or override in session details
            messages: promptObj.messages,
            system: promptObj.sessionDetails.systemPrompt,
            toolConfig: { tools: tools },
            inferenceConfig: {
                maxTokens: 1600,
                temperature: 0.3,
                topP: 1.0,
                stopSequences: []
            }
        };
        
        console.info("in [ invokeBedrock ] and bedrockInput ==> \n" + JSON.stringify(bedrockInput, null, 2));  

        // Instantiate the object that LLM returns.
        let returnObj = {};
        returnObj.role = "assistant";
        returnObj.content = [];    
        returnObj.tool_calls = {};    
        returnObj.last = true;
        returnObj.finish_reason = "";
                    
        // call Bedrock and wait for response...
        const bedrockCommand = new ConverseStreamCommand(bedrockInput);

        //console.info("in [ invokeBedrock ] and bedrockCommand ==> \n" + JSON.stringify(bedrockCommand, null, 2));  

        const bedrockResponse = await bedrockClient.send(bedrockCommand);

        //console.info("in [ invokeBedrock ] and bedrockResponse ==> \n" + JSON.stringify(bedrockResponse, null, 2));  
    
        const contentBlocks = []; // Array for llm responses (could be text or tool use)
        contentBlocks.push({ responseType: "", content: "" }); // There will be at least one content block

        //console.info("in [ invokeBedrock ] and instantiated contentBlocks ==> \n" + JSON.stringify(contentBlocks, null, 2));

        // Iterate over stream returned from Bedrock
        for await (const chunk of bedrockResponse.stream) {
            try {    
                //console.info("chunk => \n" + JSON.stringify(chunk, null, 2)); 
                
                if (chunk.contentBlockStart && chunk.contentBlockStart.contentBlockIndex !== 0) {
                    
                    //console.info("Adding additional contentBlock...");

                    contentBlocks.push({
                        responseType: "toolUse",
                        content: "",
                        toolUseName: chunk.contentBlockStart.start.toolUse.name,
                        toolUseId: chunk.contentBlockStart.start.toolUse.toolUseId
                    });            

                } else if (chunk.contentBlockDelta) {
                    
                    if (chunk.contentBlockDelta.delta?.text) {
                        
                        contentBlocks[chunk.contentBlockDelta.contentBlockIndex].responseType = "text";
                        contentBlocks[chunk.contentBlockDelta.contentBlockIndex].content += chunk.contentBlockDelta.delta.text || '';

                        // Send text (current chunk content) back to WebSocket & Twilio for TTS
                        // Text is streamed back immediately to minimize latency
                        //console.info("Sending text to WebSocket ==> ", JSON.stringify({type:"text", token:chunk.contentBlockDelta.delta.text, last:false}));
                        promptObj.socket.send(JSON.stringify({type:"text", token:chunk.contentBlockDelta.delta.text, last:false}));
                        //SEND TO CLIENT TOO!

                    } else if (chunk.contentBlockDelta.delta?.toolUse) {

                        // Parse the content to build tool call
                        contentBlocks[chunk.contentBlockDelta.contentBlockIndex].responseType = "toolUse";
                        contentBlocks[chunk.contentBlockDelta.contentBlockIndex].content += chunk.contentBlockDelta.delta.toolUse?.input;

                    }
                
                } else if (chunk.contentBlockStop) {
                    
                    if (contentBlocks[chunk.contentBlockStop.contentBlockIndex].responseType == "text") {

                        // Current text turn has ended
                        //console.info("Sending text to WebSocket ==> ");
                        promptObj.socket.send(Buffer.from(JSON.stringify({type:"text", token:"", last:true})));                 
                    }
                    
                } else if (chunk.messageStop) {            

                    returnObj.finish_reason = chunk.messageStop.stopReason;

                } else if (chunk.metadata) {
                    // Metadata
                    //console.log("metadata for this turn => ", chunk.metadata);
                }
            } catch (error) {
                console.error("Error processing chunk: ", error);
                throw new Error('Error processing chunk: ' + error.message);
            }
        }

        // Iterate over contentBlocks to complete returnObj
        contentBlocks.forEach((block) => {

            //console.info("in [ invokeBedrock ] and iterating on contentBlocks ==> \n" + JSON.stringify(block, null, 2));  

            if (block.responseType === "text") {

                returnObj.content.push( { "text": block.content } ); 

            } else if (block.responseType == "toolUse") {
                
                //console.error("toolUse block => ", JSON.stringify(block, null, 2));
                
                let toolUseId = (block.toolUseId) ? block.toolUseId : "yyyyzzzz"; 
                // Default value if not set (needed at time of writing to catch
                // edge cases where toolUseId is not set)

                let toolCall = {
                    toolUse: {
                        toolUseId: toolUseId,
                        name: block.toolUseName,
                        // ConverseStream toolUse input needs to be decoded
                        // and is left as a string and then parsed by the tool
                        input: JSON.parse(decodeURI(block.content))
                    }
                };

                // This is persisted to the conversation
                returnObj.content.push( toolCall ); 

                // This is used to make the tool call
                returnObj.tool_calls[block.toolUseId] = toolCall.toolUse;

            }

        });
        
        //console.info("In Handle Prompt about to return...\n" + JSON.stringify(returnObj, null, 2)); 

        return returnObj;

    } catch (error) {
        console.error("Error in invokeBedrock: ", error);
        if(error.name === 'ThrottlingException') {
            console.error("ThrottlingException: from Bedrock.");
            // In some instances, the Bedrock API may throttle requests.
            // Handle the error accordingly, e.g., retry after a delay
            promptObj.socket.send(Buffer.from(JSON.stringify({type:"text", token:"We are sorry but the Bedrock service is experiencing processing delays.", last:true})));                 
        } else {
            throw new Error('Error in invokeBedrock: ' + error.message);
        }
    }    
}   
