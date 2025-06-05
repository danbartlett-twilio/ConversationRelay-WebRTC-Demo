/**
 * dtmf.mjs
 * 
 * Manage the tools available for this use case here.
 */

export const dtmf = 
{
    "1": {"replyWithText":true, "replyText":"Let me get the available apartments.", "replyWithFunction":true, "replyFunction":"ListAvailableApartmentsFunction"},
    "2": {"replyWithText":true, "replyText":"I'll check on your appointments", "replyWithFunction":true, "replyFunction":"CheckExistingAppointmentsFunction"},
    "3": {"replyWithText":true, "replyText":"You pressed 3.", "replyWithFunction":false, "replyFunction":""},
    "4": {"replyWithText":true, "replyText":"You pressed 4.", "replyWithFunction":false, "replyFunction":""},
    "5": {"replyWithText":true, "replyText":"You pressed 5.", "replyWithFunction":false, "replyFunction":""},
    "6": {"replyWithText":true, "replyText":"You pressed 6.", "replyWithFunction":false, "replyFunction":""},
    "7": {"replyWithText":true, "replyText":"You pressed 7.", "replyWithFunction":false, "replyFunction":""},
    "8": {"replyWithText":true, "replyText":"You pressed 8.", "replyWithFunction":false, "replyFunction":""},
    "9": {"replyWithText":true, "replyText":"You pressed 9.", "replyWithFunction":false, "replyFunction":""},
    "0": {"replyWithText":true, "replyText":"You pressed 0.", "replyWithFunction":false, "replyFunction":""}
};