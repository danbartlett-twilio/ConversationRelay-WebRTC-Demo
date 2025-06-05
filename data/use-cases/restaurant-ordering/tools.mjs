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
  }      

];