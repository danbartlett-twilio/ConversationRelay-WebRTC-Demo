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
          name: "LiveAgentHandoffTool",
          description:
            "Initiates a handoff to a live agent based on user request or sensitive topics.",
          parameters: {
            type: "object",
            properties: {
              reason: {
                type: "string",
                description:
                  "The reason for the handoff, such as user request, legal issue, financial matter, or other sensitive topics.",
              },
              context: {
                type: "string",
                description:
                  "Any relevant conversation context or details leading to the handoff.",
              },
            },
            required: ["reason"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "SendSms",
          description:
            "Sends an SMS confirmation for a scheduled tour to the user.",
          parameters: {
            type: "object",
            properties: {
              appointmentDetails: {
                type: "object",
                properties: {
                  to_phone: {
                    type: "string",            
                    description: "The E.164 formatted phone number to receive the SMS.",
                  },                  
                  date: {
                    type: "string",
                    description: "The date of the scheduled tour (YYYY-MM-DD).",
                  },
                  time: {
                    type: "string",
                    description:
                      "The time of the scheduled tour (e.g., '10:00 AM').",
                  },
                  type: {
                    type: "string",
                    enum: ["in-person", "self-guided"],
                    description:
                      "The type of tour (either in-person or self-guided).",
                  },
                  apartmentType: {
                    type: "string",
                    enum: ["studio", "one-bedroom", "two-bedroom", "three-bedroom"],
                    description: "The type of apartment for the tour.",
                  },
                },
                required: ["to_phone", "date", "time", "type", "apartmentType"],
              }              
            },
            required: ["appointmentDetails"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "ScheduleTourTool",
          description: "Schedules a tour for the user at the apartment complex.",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description:
                  "The date the user wants to schedule the tour for (YYYY-MM-DD).",
              },
              time: {
                type: "string",
                description:
                  'The time the user wants to schedule the tour for (e.g., "10:00 AM").',
              },
              type: {
                type: "string",
                enum: ["in-person", "self-guided"],
                description: "The type of tour, either in-person or self-guided.",
              },
              apartmentType: {
                type: "string",
                enum: ["studio", "one-bedroom", "two-bedroom", "three-bedroom"],
                description:
                  "The layout of the apartment the user is interested in.",
              },
            },
            required: ["date", "time", "type", "apartmentType"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "CheckAvailabilityTool",
          description:
            "Checks the availability of tour slots based on the user's preferences.",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description:
                  "The date the user wants to check for tour availability (YYYY-MM-DD).",
              },
              time: {
                type: "string",
                description:
                  'The time the user wants to check for availability (e.g., "10:00 AM").',
              },
              type: {
                type: "string",
                enum: ["in-person", "self-guided"],
                description: "The type of tour, either in-person or self-guided.",
              },
              apartmentType: {
                type: "string",
                enum: ["studio", "one-bedroom", "two-bedroom", "three-bedroom"],
                description:
                  "The layout of the apartment the user is interested in.",
              },
            },
            required: ["date", "type", "apartmentType"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "ListAvailableApartmentsTool",
          description:
            "Lists available apartments based on optional user criteria.",
          parameters: {
            type: "object",
            properties: {
              date: {
                type: "string",
                description:
                  "The move-in date the user prefers (optional, YYYY-MM-DD).",
              },
              budget: {
                type: "integer",
                description:
                  "The budget the user has for rent per month (optional).",
              },
              apartmentType: {
                type: "string",
                enum: ["studio", "one-bedroom", "two-bedroom", "three-bedroom"],
                description:
                  "The layout of the apartment the user is interested in (optional).",
              },
            },
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "CheckExistingAppointmentsTool",
          description: "Retrieves the list of appointments already booked.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "CommonInquiriesTool",
          description:
            "Handles common inquiries such as pet policy, fees, and other complex details, with the option to specify the apartment type.",
          parameters: {
            type: "object",
            properties: {
              inquiryType: {
                type: "string",
                enum: [
                  "pet policy",
                  "fees",
                  "parking",
                  "specials",
                  "income requirements",
                  "utilities",
                ],
                description:
                  "The type of inquiry the user wants information about.",
              },
              apartmentType: {
                type: "string",
                enum: ["studio", "one-bedroom", "two-bedroom", "three-bedroom"],
                description:
                  "The apartment type for which the inquiry is being made (optional).",
              },
            },
            required: ["inquiryType"],
          },
        },
      },
];