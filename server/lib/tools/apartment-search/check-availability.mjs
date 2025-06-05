import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult} from '../save-tool-result.mjs';
import { normalizeTimeFormat } from './apartment-search-utils.mjs';

async function checkAvailability(tool) {
    
    const { date, time, type, apartmentType } = JSON.parse(tool.function.arguments);
  
    const appointments = new FSDB(`../data/use-cases/apartment-search/data.appointments.json`, false);
    const availableAppointments = appointments.getAll();   

    console.log(
      `[checkAvailability] Current available appointments:`,
      availableAppointments
    );
    console.log(`[checkAvailability] Received arguments:`, tool);
  
    // Step 1: Check for missing fields and create messages for the LLM to ask the user for them
    const missingFields = [];
  
    if (!date) {
      missingFields.push("date");
    }
  
    if (!type) {
      missingFields.push("tour type (e.g., in-person or self-guided)");
    }
  
    if (!apartmentType) {
      missingFields.push("apartment type (e.g., studio, one-bedroom, etc.)");
    }
  
    // If there are missing fields, return the structured message for the LLM to prompt the user
    if (missingFields.length > 0) {
      return {
        missing_fields: missingFields,
        message: `Please provide the following details: ${missingFields.join(
          ", "
        )}.`,
      };
    }
  
    let normalizedTime = null;
    if (time) {
      normalizedTime = normalizeTimeFormat(time);
    }
  
    // Step 2: Check for an exact match (date, time, type, apartmentType)
    let exactMatchSlot = null;
    if (time) {
      exactMatchSlot = availableAppointments.find(
        (slot) =>
          slot.date === date &&
          slot.time === normalizedTime &&
          slot.type === type &&
          slot.apartmentType === apartmentType
      );
    }
  
    if (exactMatchSlot) {
      console.log(`[checkAvailability] Exact match found.`);
      return {
        availableSlots: [exactMatchSlot],
        message: `The ${time} slot on ${date} is available for an ${type} tour of a ${apartmentType} apartment. Would you like to book this?`,
      };
    }
  
    // Step 3: Check for similar matches (same date, type, apartmentType but different time)
    let similarDateSlots = availableAppointments.filter(
      (slot) =>
        slot.date === date &&
        slot.type === type &&
        slot.apartmentType === apartmentType
    );
  
    if (similarDateSlots.length > 0) {
      console.log(
        `[checkAvailability] Similar matches found (different time on the same date).`
      );
      return {
        availableSlots: similarDateSlots,
        message: `The ${time} slot on ${date} isn't available. Here are other available times for that day: ${similarDateSlots
          .map((slot) => slot.time)
          .join(", ")}. Would any of these work for you?`,
      };
    }
  
    // Step 4: Check for broader matches (same type, apartmentType but different date)
    let broaderSlots = availableAppointments.filter(
      (slot) => slot.type === type && slot.apartmentType === apartmentType
    );
  
    if (broaderSlots.length > 0) {
      console.log(`[checkAvailability] Broader matches found (different date).`);
      return {
        availableSlots: broaderSlots,
        message: `There are no available slots on ${date} for a ${apartmentType} apartment, but here are other available dates: ${broaderSlots
          .map((slot) => `${slot.date} at ${slot.time}`)
          .join(", ")}. Would any of these work for you?`,
      };
    }
  
    // Step 5: If no matches are found at all
    console.log(`[checkAvailability] No available slots found.`);
    return {
      availableSlots: [],
      message: `There are no available slots for a ${apartmentType} apartment at this time. Would you like to explore other options or check availability later?`,
    };
}


export async function CheckAvailabilityTool(tool) {

    console.info("EVENT\n" + JSON.stringify(tool, null, 2));    

    try {

        let toolResult = await checkAvailability(tool);

        await saveToolResult(tool, toolResult);        
        
        return true;

    } catch (error) {
        
        console.log("Error failed to complete the function [CheckAvailabilityTool] => ", error);
        
        return false;

    }    

};