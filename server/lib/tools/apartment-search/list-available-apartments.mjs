import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult} from '../save-tool-result.mjs'; 

// Function to list available apartments
async function listAvailableApartments(tool) {
  
  const args = JSON.parse(tool.function.arguments);
  
  const apartments = new FSDB(`../data/use-cases/apartment-search/data.apartments.json`, false);
  const apartmentDetailsRecord = apartments.get("apartmentDetails");
  const apartmentDetails = JSON.parse(apartmentDetailsRecord.details);

  try {
    let apartments = Object.keys(apartmentDetails).map((type) => ({
      type,
      ...apartmentDetails[type],
    }));

    // Filter based on user input
    if (args.date) {
      apartments = apartments.filter(
        (apt) => new Date(apt.moveInDate) <= new Date(args.date)
      );
    }
    if (args.budget) {
      apartments = apartments.filter((apt) => apt.rent <= args.budget);
    }
    if (args.apartmentType) {
      apartments = apartments.filter((apt) => apt.type === args.apartmentType);
    }

    // Summarize available apartments
    const summary = apartments
      .map(
        (apt) =>
          `${apt.layout}: $${apt.rent} per month, available from ${
            apt.moveInDate
          }. Features: ${apt.features.join(", ")}.`
      )
      .join("\n\n");

    // If apartments are found, return the structured response
    if (apartments.length > 0) {
      return {
        availableApartments: summary,
        message: `Here are the available apartments based on your search: \n\n${summary}`,
      };
    } else {
      // No apartments found based on the filters
      return {
        availableApartments: [],
        message: "No apartments are available that match your search criteria.",
      };
    }
  } catch (error) {
    console.log(
      `[listAvailableApartments] Error listing available apartments: ${error.message}`
    );
    // Return error message as structured JSON
    return {
      availableApartments: null,
      message: "An error occurred while listing available apartments.",
    };
  }
}

export async function ListAvailableApartmentsTool(tool) {

    console.info("EVENT\n" + JSON.stringify(tool, null, 2));    

    try {

        let toolResult = await listAvailableApartments(tool);

        await saveToolResult(tool, toolResult);
  
        return true;

    } catch (error) {
        
        console.log("Error failed to complete the function [ListAvailableApartmentsFunction] => ", error);
        
        return false;

    }    

};