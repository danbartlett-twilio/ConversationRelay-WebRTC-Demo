/**
 * tools.mjs
 * 
 * Manage the tools available for this use case here.
 */

export const tools = 
[
  {
    type: "function",
    function: {
      name: "PlaceOrder",
      description:
        "When a caller has finished adding items to an order, use this tool to save and place the order.",
      parameters: {
        type: "object",
        properties: {
          current_order: {
            type: "array",
            description: "The restaurant order containing all of the items the user wants in this order.",
            items: {              
              type: "object",
              properties: {
                "line_item": {
                  type: "string",
                  description: "The menu title of the item in the order plus any additions like toppings."
                },
                "additonal_details": {
                  type: "string",
                  description: "Additional toppings or any details about this menu item."
                },                
                "line_amount": {
                  type: "number",
                  description: "The amount of this item in the order."
                }                                
              },
              required: ["line_item", "line_amount"],
            }
          },
          order_type: {
            type: "string",
            enum: ["pickup", "delivery"],
            description: "The type of order.",
          },
          order_total: {
            type: "number",
            description: "The sum amount of all of order items."
          },  
          delivery_address: {
            type: "string",
            description: "Street address, city, state and zip code for the delivery."
          },            
        },
        required: ["order_type", "order_total"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "CheckRestaurantPickUpTime",
      description:
        "This function checks to see when the order will be ready for pickup.",
      parameters: {
        type: "object",
        properties: {
          order_type: {
            type: "string",
            enum: ["pickup", "delivery"],
            description: "The type of order.",
          }          
        },
        required: ["order_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "CheckRestaurantDeliveryTime",
      description:
        "This function checks to see when the order will be delivered.",
      parameters: {
        type: "object",
        properties: {
          order_type: {
            type: "string",
            enum: ["pickup", "delivery"],
            description: "The type of order.",
          }          
        },
        required: ["order_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "SendSms",
      description:
        "Sends an SMS message if requested by the user for the order confirmation or for restaurant hours or location.",
      parameters: {
        type: "object",
        properties: {
          to_phone: {
            type: "string",            
            description: "The E.164 formatted phone number to receive the SMS.",
          },
          message_type: {
            type: "string",
            enum: ["order confirmation", "hours", "location"],
            description: "The type of message to send.",
          },              
          restaurant_hours: {
            type: "string",
            description: "The hours of operation for the restaurant.",
          },
          restaurant_location: {
            type: "string",
            description: "The location of the restaurant.",
          },              
        },
        required: ["to_phone", "message_type"],
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
          order_type: {
            type: "string",
            enum: ["pickup", "delivery"],
            description: "The type of order.",
          },          
          message_type: {
            type: "string",
            enum: ["order confirmation"],
            description: "The type of email to send.",
          },          
          to_email: {
            type: "string",            
            description: "The email address confirmed by the caller.",
          }                      
        },
        required: ["to_email"],
      },
    },
  },        

];