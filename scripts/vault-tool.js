Javascript
/**
 * Receives secret updates from the Vault CLI.
 */
function doPost(e) {
  const authorizedKey = PropertiesService.getScriptProperties().getProperty('VAULT_ACCESS_KEY');
  const data = JSON.parse(e.postData.contents);
  
  // Security Handshake
  if (e.parameter.key !== authorizedKey && data.authKey !== authorizedKey) {
    return ContentService.createTextOutput("Unauthorized").setMimeType(ContentService.MimeType.TEXT);
  }

  const ss = SpreadsheetApp.openById('1qf9fChZmrzKHwyaiA2FN8q-fImn3Pg5lQQt-4EDw33A');
  const sheet = ss.getSheetByName('map');
  
  // Logic to find the row based on the "Feature" name (Gemini, Firebase, Master)
  const dataRange = sheet.getDataRange().getValues();
  for (let i = 0; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.feature) { // Assumes Feature Name is in Column A
      sheet.getRange(i + 1, 6).setValue(data.value); // Updates Secret in Column F
      sheet.getRange(i + 1, 5).setValue(new Date()); // Updates Rotation Date in Column E
      break;
    }
  }

  return ContentService.createTextOutput("Vault Synced Successfully").setMimeType(ContentService.MimeType.TEXT);
}
