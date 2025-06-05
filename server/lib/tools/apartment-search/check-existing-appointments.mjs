import { FSDB } from "file-system-db"; // https://github.com/WillTDA/File-System-DB
import { saveToolResult} from '../save-tool-result.mjs';



// Function to check existing appointments
async function checkExistingAppointments(tool) {

  // Handles users without a profile
  let userPk = (tool.userContext?.pk) ? tool.userContext.pk : tool.call_details.from_phone;

  const existingAppointments = new FSDB(`../data/use-cases/apartment-search/data.user.appointments.json`, false);  
  const userAppointments = existingAppointments.startsWith(userPk);   

  // If user has appointments, return them
  if (userAppointments.length > 0) {

    const userAppointments = userAppointments.map( app => {
      return { ...app.appointment };
    });
    
    return {
      appointments: userAppointments,
      message: `You have the following appointments scheduled: ${userAppointments
        .map(
          (appt) =>
            `${appt.date} at ${appt.time} for a ${appt.apartmentType} tour (${appt.type} tour).`
        )
        .join("\n")}`,
    };
  } else {
    // No appointments found
    return {
      appointments: [],
      message:
        "You don't have any appointments scheduled. Would you like to book a tour or check availability?",
    };
  }
}

export async function CheckExistingAppointmentsTool(tool) {

    console.info("EVENT\n" + JSON.stringify(tool, null, 2));    

    try {

        let toolResult = await checkExistingAppointments(tool);

        await saveToolResult(tool, toolResult);

        return true;

    } catch (error) {
        
        console.log("Error failed to complete the function [CheckExistingAppointmentsTool] => ", error);
        
        return false;

    }    

};
