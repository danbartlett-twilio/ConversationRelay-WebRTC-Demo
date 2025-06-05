import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult} from '../save-tool-result.mjs';
import { normalizeTimeFormat } from './apartment-search-utils.mjs';
// Function to schedule a tour
async function scheduleTour(tool) {
  
  const { date, time, type, apartmentType }  = JSON.parse(tool.function.arguments);      

  const appointments = new FSDB(`../data/use-cases/apartment-search/data.appointments.json`, false);
  const appointmentsRaw = appointments.getAll();   
  const availableAppointments = appointmentsRaw.Items.map(appointment => {                
      return { ...appointment.appointment };
  });         

  console.log(
    `[scheduleTour] Current available appointments:`,
    availableAppointments
  );
  console.log(`[scheduleTour] Received arguments:`, tool);

  // Normalize the time input
  const normalizedTime = normalizeTimeFormat(time);
  console.log(`[scheduleTour] Normalized Time: ${normalizedTime}`);

  // Find the index of the matching available appointment slot
  const index = availableAppointments.findIndex(
    (slot) =>
      slot.date === date &&
      slot.time === normalizedTime &&
      slot.type === type &&
      slot.apartmentType === apartmentType
  );

  console.log(`[scheduleTour] Index found: ${index}`);

  // If no matching slot is found, return a message indicating unavailability
  if (index === -1) {
    console.log(`[scheduleTour] The requested slot is not available.`);
    return {
      available: false,
      message: `The ${normalizedTime} slot on ${date} is no longer available. Would you like to choose another time or date?`,
    };
  }


  // DELETE 
  let appt_key = `${date}::${time}::${apartmentType}::${type}`;

  const deleteAppointment = appointments.delete(appt_key);     
  
  console.log("deleteAppointment => ", deleteAppointment);
/*
  // Handles users without a profile
  let userPk = (tool.userContext?.pk) ? tool.userContext.pk : tool.call_details.from_phone;
  
  // Save new appointment linked to the user to the database              
  let confirmedAppointment = {
    pk: userPk,
    sk: `apartmentAppointment::${appt_sk}`,
    appointment: availableAppointments[index], // Add ID?
    expireAt:  parseInt((Date.now() / 1000) + (86400 * 7))  // Expire "demo" session data automatically (can be removed)
  };
  
  await ddbDocClient.send(
    new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: confirmedAppointment
  }));  
*/
  console.log(`[scheduleTour] Appointment successfully scheduled.`);

  // Return confirmation message for the successful scheduling
  return {
    available: true,
    message: `Your tour is scheduled for ${date} at ${normalizedTime}. Would you like a confirmation via SMS?`,
  };
}

export async function ScheduleTourTool(tool) {

    console.info("EVENT\n" + JSON.stringify(tool, null, 2));    

    try {

        let toolResult = await scheduleTour(tool);

        await saveToolResult(tool, toolResult);

        return true;

    } catch (error) {
        
        console.log("Error failed to complete the function [ScheduleTourFunction] => ", error);
        
        return false;

    }    

};