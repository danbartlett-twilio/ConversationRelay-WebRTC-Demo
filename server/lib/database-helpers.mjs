import { FSDB } from "file-system-db"; 

/**
 * 
 * savePrompt
 * 
 * This helper function saves a prompt to the database. This
 * is the chat history for a session and the sort key is chronological
 * so that chats are automatically sorted by time.
 * 
 * This implement sets an TTL (expireAt) date to delete chats automatically.
 * The TTL would presumably be changed in production uses.
 * 
 */
export async function savePrompt(callSid, newChatMessage) {
    try {
        const sessionChats = new FSDB(`../data/sessions/${callSid}/chats.json`, false);

        newChatMessage.timestamp = Date.now();

        sessionChats.set(`chat::${Date.now().toString()}`, newChatMessage);

        return true;

    } catch (error) {
        
        console.error("Error saving prompt to database: ", error);
        throw error;

    }
};

/**
 * returnAllChats
 * 
 * Get all chats for a current session. Sort key is a timestamp
 * to chats are automatically returned in chronological order.
 */
export async function returnAllChats(callSid) {
    try { 

        const sessionChats = new FSDB(`../data/sessions/${callSid}/chats.json`, false);
        
        return sessionChats.getAll().map(chat => {                        
            return { ...chat.value };
        });

    } catch (error) {

        console.error("Error getting all chats: ", error);
        throw error;
        
    }   
}