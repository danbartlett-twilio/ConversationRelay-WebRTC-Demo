import { invokeBedrock } from './invoke-bedrock.mjs';
import { invokeOpenAI } from './invoke-open-ai.mjs';
import { returnAllChats, savePrompt} from './database-helpers.mjs';
import { formatLLMMessage } from './llm-formatting-helpers.mjs';

export async function prepareAndCallLLM(prepareObj) {
    try {
        
        //console.info("in [ prepareAndCallLLM ] and prepareObj ==> \n" + JSON.stringify(prepareObj, null, 2));  

        /**
         * SEQUENCE SUMMARY
         * 1) Get chat history
         * 2) Persist current prompt (if not tool call completion)
         * 3) Call LLM
         * 4) Handle response from LLM
         */
        
        // Get all chat messages for this session 
        // All messages saved with connectionId as primary key
        // and string with timestamp for simple query that
        // returns chronologically sorted results.
        // This is the chat history between system, assistant, tools, user
        const messages = await returnAllChats(prepareObj.callSid);    

        // If this is a prompt from the WebSocket connection, then it
        // is text (speech-to-text) from the user. Persist the user prompt 
        // to the database and include it in chat messages before calling LLM.
        if (prepareObj.body?.type === "prompt") { // VOICE PROMPT EVENT
            
            // Format the prompt from the user to LLM standards.            
            let newUserChatMessage  = await formatLLMMessage("user", prepareObj.body.voicePrompt);                                                      

            //console.info("newUserChatMessage in prepareAndCallLLM => " + JSON.stringify(newUserChatMessage, null, 2));
            
            // Persist the current prompt so it is included in subsequent calls.
            await savePrompt(prepareObj.callSid, newUserChatMessage);                

            // Add message to context before calling LLM in this current event.
            messages.push( newUserChatMessage );
        
        } else if (prepareObj.body?.type === "dtmf") { // DTMF EVENT               
            // "dtmf" event is from the WebSocket server, then the
            // user has pushed a phone button. Build a prompt for this case.

            /**
             * {
             *  'type': 'dtmf',
             *  'digit': '1'
             * }
             */
            
            // dtmf handlers are included in the use case configuration and
            // attached to a session. The dtmf handlers can be overwritten
            // if need as a user moves through a session.
            let dtmfHandlers = JSON.parse(prepareObj.sessionDetails.dtmfHandlers);                
            //console.info("==> dtmfHandlers\n" + JSON.stringify(dtmfHandlers, null, 2));   
            
            // Pull the response associated to the digit pressed
            let dtmfResponse = dtmfHandlers[prepareObj.body.digit];
            //console.info("==> dtmfResponse\n" + JSON.stringify(dtmfResponse, null, 2));                

            if (!dtmfResponse) {
                
                console.log("Could not find DTMF handler for current use case / digit.");
                throw new Error('Could not find DTMF handler for current use case / digit.');

            } else {

                // Format the dtmf event from the user into to LLM standards.
                let newUserDTMFMessage = { 
                    role: "system", 
                    content: `The user pushed the ${prepareObj.body?.digit} keypad button.` 
                };

                if (dtmfResponse.replyWithText) {

                    newUserDTMFMessage.content = newUserDTMFMessage.content + ` Reply to the user with this text: "${dtmfResponse.replyText}"`; 
                    
                    // If a tool call is required, then the reply text needs
                    // to sent here because the LLM will not return the text
                    // because it is will be told to only return the tool call (function)
                    if (dtmfResponse.replyWithFunction) {
                        promptObj.socket.send(
                            JSON.stringify(
                                {
                                    type:"text", 
                                    token: dtmfResponse.replyText, 
                                    last:true
                                })
                        );
                    }
                }

                // If the dtmf tiggers a tool call, then adjust the prompt to llm accordingly.
                if (dtmfResponse.replyWithFunction) {
                    // set object for tool choice
                    tool_choice = { "type": "function", "function": {"name":dtmfResponse.replyFunction }};
                    newUserDTMFMessage.content = newUserDTMFMessage.content + " Call the tool and wait.";                                                                       
                }                    
                
                // Persist the current prompt so it is included in subsequent calls.                
                await savePrompt(prepareObj.ddbDocClient, prepareObj.callSid, prepareObj.newUserDTMFMessage);

                // Add message to context before calling LLM in this current event.
                messages.push( newUserDTMFMessage );

            }


        } else if (prepareObj.toolCallCompletion) { // TOOL CALL COMPLETION EVENT

            /**
             * Upon completing one or more tool calls, this function is
             * invoked to continue the conversation. The tool call functions
             * updatethe database with their results so they would already be 
             * in the "messages" array. 
             * 
             * The boolean toolCallCompletion is passed to the LLM handler
             * and the call to the LLM can be adjusted if needed.
             * 
             * No additional processing needed for current implementation, but if
             * needed, it could be done here.
             */

        }

        //console.info("messages before calling LLM\n" + JSON.stringify(messages, null, 2));   

        const AIPlatformHandler = {
            invokeBedrock,
            invokeOpenAI            
        };

        console.info("process.env.AI_PLATFORM => " + process.env.AI_PLATFORM);

        // Call the LLM passing context and chat history
        return await AIPlatformHandler[process.env.AI_PLATFORM]({
            messages: messages,
            sessionDetails: prepareObj.sessionDetails,
            toolCallCompletion: prepareObj.toolCallCompletion,
            tool_choice: prepareObj.tool_choice,
            socket: prepareObj.socket,
            clientSocket: prepareObj.clientSocket
        });
        
    } catch (error) {
        
        console.error("Error in prepareAndCallLLM: ", error);
        throw error;
        
    }
}