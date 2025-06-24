import { FSDB } from "file-system-db";  // https://github.com/WillTDA/File-System-DB
const useCases = new FSDB("../data/use-cases.json", false);
const users = new FSDB("../data/users.json", false);
const crSessions = new FSDB("../data/cr-sessions.json", false);
import { formatLLMMessage, returnDefaultModel } from "./llm-formatting-helpers.mjs"; //

export const setupCallPostHandler = async (twilioBody) => {
    
    console.info("twilioBody.From ==>\n" + JSON.stringify(twilioBody.From, null, 2));

    /**
     * First, use the FROM caller to get the user profile. This
     * allows you to personalize the experience.
     * From number could be a phone number, sip address, or WebRTC client.
     */    
    let userContext = {
        "pk": twilioBody.From,
        "firstName": "Jane",
        "lastName": "Doe",
        "useCase": "albert-einstein",
        "conversationRelayParamsOverride": {}
    }; 
    try {       
        let from = twilioBody.From.replace("client:", ""); // Remove "client:" prefix if present
        let user = users.get(from);  // Pull user profile from database
        if (user !== undefined) {
            userContext = user;
        }        
    } catch (err) {
        console.error("Error getting user profile from database: ", err);
    }
    
    //console.info("userContext ==>\n" + JSON.stringify(userContext, null, 2));    
    //console.info("userContext.useCase ==>\n" + userContext.useCase);    
    
    /**
     * Use the use case title from the user context if present or default to 
     * use case set in the environment variable.
     * The use case contains the prompt and other configuration details and
     * can be changed dynamically for each call and during a session.
     */
    const useCaseTitle = (userContext.useCase) ? userContext.useCase : process.env.STACK_USE_CASE;    
    
    console.info("useCaseTitle ==> " + useCaseTitle);    

    let useCase = null;
    try {        
        let useCaseRecord = useCases.get(useCaseTitle);
        if (useCaseRecord !== undefined) {
            useCase = useCaseRecord;
            useCase = {
                ...useCase, // Add use case configuration
                ...userContext.conversationRelayParamsOverride // Override conversation relay params from user context (if needed)
            };            
        }   
    } catch (err) {
        console.error("Error getting use case configuration from database: ", err);
    }
    
    //console.info("useCase ==>\n" + JSON.stringify(useCase, null, 2));    
    
    // Set the prompt to what was returned from DynamoDB.
    let prompt = useCase.prompt;

    /**
     * This step shows how you dynamically change the prompt based on the user context.
     * Here we are insterting the user's name into the prompt if it exists otherwise,
     * we tell the LLM to ask for the user's name. This is a simple example but you can
     * add as much complexity as you need to the prompt.
    */
    if (Object.keys(userContext).length  > 0 && userContext.firstName && userContext.lastName) {
        prompt = prompt.replace('<<USER_CONTEXT>>', `The name of the person you are talking to is ${userContext.firstName} ${userContext.lastName}. You do not need to ask for their name.`);
    } else {
        prompt = prompt.replace('<<USER_CONTEXT>>', `First ask for the user's first and last name to use during the call.`);
    }    
   
    let timeZone = (process.env.TIMEZONE) ? process.env.TIMEZONE : "America/Los_Angeles";  // Edit to your specifications or could be dynamic based on user
    
    const currentDate = new Date();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: timeZone
    });
    
    prompt = prompt.replace('<<CURRENT_DATE>>', dateFormatter.format(currentDate));

    /**
     * ConversationRelay can handle DTMF events. DTMF handlers can be configured
     * here and then saved into database for the session. ConversationRelay will
     * pass DTMF events to your application via the WebSocket connection.
     * For this implementation, the dtmf handlers are stored in the use case
     * configuration in the database. The dtmf handlers can be changed dynamically
     * for each session.
     * https://www.twilio.com/docs/voice/twiml/connect/conversationrelay#dtmf-message
     */
    const dtmfHandlers = useCase.dtmfHandlers;

    /**
     * For this implementation, the tools are stored in the use case. You can
     * dynamically change the tools available to the LLM during a session.
     */
    const tools = useCase.tools;

    /**
     * Using AWS Bedrock enables your application to dynamically
     * switch models. Select the best model for each session and even change dynamically.
     * Note that any set model needs be available and configured in your account and region.
     * https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
     * https://docs.aws.amazon.com/bedrock/latest/userguide/amazon-bedrock-marketplace.html
     * https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-use.html
     */    
    // Set the LLM Model at the use case or default to the model set in the environment variable.
    const llmModel = (useCase.llmModel) ? useCase.llmModel : await returnDefaultModel(); 

    try {

        /**
         * To track each session, we use the CallSid from Twilio. This is a unique
         * identifier for each call and is used as the primary key in DynamoDB.
         * You implementation could be different, but using the CallSid from Twilio 
         * makes sense as it is a unique key and can easily be tied back to Twilio logs.
         * 
         * In the code below, we are saving the details for this session 
         * so that it will be availble throughout the conversation.
         */           

        let sessionData = {                  
            llmModel: llmModel, // LLM model to use for this session
            useCase: useCaseTitle,
            useCaseName: useCase.name,
            useCaseTitle: useCase.title,
            useCaseDescription: useCase.description, 
            welcomeGreeting: useCase.welcomeGreeting, // Welcome greeting for the session
            userContext: userContext,
            systemPrompt: [ { text: prompt } ],
            tools: tools, // tools passed into session -- can be changed dynamically.
            dtmfHandlers: dtmfHandlers, // dtmf handlers passed into session -- can be changed dynamically.
            timeStamp: Date.now(), // Expire "demo" session data automatically (can be removed)
            ...twilioBody, // include data from Twilio    
        };

        // Save the session data to the file system "database"
        crSessions.set(twilioBody.CallSid, sessionData);
        const crSession = new FSDB(`../data/sessions/${twilioBody.CallSid}/session.json`, false);
        crSession.set(twilioBody.CallSid, sessionData);

        const sessionChats = new FSDB(`../data/sessions/${twilioBody.CallSid}/chats.json`, false);
        // Format the prompt from the user to LLM standards.            
        let systemChatMessage  = await formatLLMMessage("system", prompt);           
        sessionChats.set("chat::" + Date.now().toString(), systemChatMessage);
        let welcomeGreeting  = await formatLLMMessage("assistant", useCase.conversationRelayParams.welcomeGreeting);
        welcomeGreeting.timestamp = Date.now();
        sessionChats.set("chat::" + Date.now().toString(), welcomeGreeting);

        /**
         * ConversationRelay is extremely configurable. Attributes can be passed in
         * to meet your application requirements as well as your user's requirements.
         * Attributes are set here dynamically for each session.
         * Amoung attributes that can be passed in are: welcomeGreeting, speechModel, voice, 
         * ttsProvider, language, interruptible... Full list of attributes can be found here:
         * https://www.twilio.com/docs/voice/twiml/connect/conversationrelay#conversationrelay-attributes
         * For this implementation, the attributes are stored in the use case in DynamoDB. 
         * The object below is instantiated and then converted to a string that is passed
         * into the TwiML tag below.
         */ 
        let conversationRelayParams = {
            ...useCase.conversationRelayParams,
            "debug": "speaker-events tokens-played",
            ...userContext.conversationRelayParamsOverride // Override conversation relay params from user context (if needed)  
        };

        let conversationRelayParamsString = "";
        for (const [key, value] of Object.entries(conversationRelayParams)) {
            conversationRelayParamsString += `${key}="${value}" `;
            //console.log(`${key}: ${value}`);
        }

        /**
         * If needed, you can add custom parameters to the ConversationRelay TwiML
         * verb. These parameters are passed to the WebSocket connection and can be
         * used to pass data to the your applictions. These parmeters will show up
         * ONLY in the "setup" message sent by the ConversationRelay server to your application.
         * After declaring the object, we loop through the customParams object and build 
         * a string of <Parameter></Parameter> tags that get added to the TwiML.
         * https://www.twilio.com/docs/voice/twiml/connect/conversationrelay#parameter-element
         * For this implementation, we are passing the callSid to the WebSocket connection
         * so that we can tie the WebSocket connection to the call session in DynamoDB so
         * using thes Parameters is not required.
         */
        let customParams = {
            callSid:twilioBody.CallSid
            // Additional params can be added here if needed
        }; 
        let customParamsString = "";
        for (const [key, value] of Object.entries(customParams)) {
            customParamsString += `            <Parameter name="${key}" value="${value}" />
`;
            console.log(`${key}: ${value}`);
        }        
                        
        /**
         * Generate the WebSocket URL for the ConversationRelay. Twilio
         * will connect a new WebSocket connection to this URL. The CallSid
         * from Twilio is passed in the url and subsequently used to
         * access and manage the session in DynamoDB.
         */
        let ws_url = `${process.env.WS_URL}?callSid=${twilioBody.CallSid}`;

        /**
         * Generate the TwiML for the ConversationRelay. This is the Twilio's XML Language.
         * https://www.twilio.com/docs/voice/twiml
         * https://www.twilio.com/docs/voice/twiml/connect/conversationrelay
         */
        let twiml = `<?xml version="1.0" encoding="UTF-8"?><Response>    
    <Connect>
        <ConversationRelay url="${ws_url}" ${conversationRelayParamsString} >
            ${customParamsString}
        </ConversationRelay>
    </Connect>
</Response>`;
        
        //console.log("twiml ==> ", twiml);
        
        return twiml;

    } catch (err) {
        
        console.log("Error writing session details for call => ", err);                
        return;
        
    }        
};