/**
 * tools.mjs
 * 
 * Manage the tools available for this use case here.
 */

export const tools = [
  {
    type: "function",
    function: {
      name: "GetJoke",
      description:
        "This tool retrieves a joke from a joke api service.",
      parameters: {}
    },
  },
  {
    type: "function",
    function: {
      name: "GetQuote",
      description:
        "This tool retrieves a random quote.",
      parameters: {}
    },
  },
  {
    type: "function",
    function: {
      name: "SendSMS",
      description:
        "Sends a SMS message to the caller.",
      parameters: {
        type: "object",
        properties: {
          sms_type: {
            type: "string",
            enum: ["joke", "quote"],
            description: "What the caller wants to receive in the sms.",
          },                   
          to_phone: {
            type: "string",            
            description: "The E.164 formatted phone number to receive the SMS.",
          }                      
        },
        required: ["to_phone", "sms_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "SendEmail",
      description:
        "Sends an Email if requested by the user for the order confirmation.",
      parameters: {
        type: "object",
        properties: {
          email_type: {
            type: "string",
            enum: ["joke", "quote"],
            description: "What the caller wants to receive in the email.",
          },          
          to_email: {
            type: "string",            
            description: "The email address confirmed by the caller.",
          }                      
        },
        required: ["to_email", "email_type"],
      },
    },    
  }, 
  {
    type: "function",
    function: {
      name: "GetZip",
      description:
        "Gets the name of the city associated to a US Zip Code.",
      parameters: {
        type: "object",
        properties: {     
          zip: {
            type: "string",            
            description: "The zip code he user wants to look up.",
          }                      
        },
        required: ["zip"],
      },
    },    
  }   
];