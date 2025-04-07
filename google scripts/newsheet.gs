function doGet(e) {
  try {
    const newSheet = SpreadsheetApp.create("New Google Sheet");

    const sheet = newSheet.getSheets()[0];

    sheet.getRange(1, 1).setValue("Input the questions here, and the title of the sheet will be title of the questionnaire");

    return ContentService.createTextOutput(newSheet.getUrl()).setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
