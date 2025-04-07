function doGet(e) {
  var sheetId = e.parameter.sheetId;  // Retrieve the sheetId parameter
  if (!sheetId) {
    return HtmlService.createHtmlOutput("Missing sheetId!");
  }

  // Retrieve survey questions
  var questions = getQuestions(sheetId);
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheetName = spreadsheet.getName();
  
  // Generate an HTML page and pass the questions to the front end
  var template = HtmlService.createTemplateFromFile('index');
  template.questions = questions;
  template.surveyName = sheetName;
  template.sheetId = sheetId;
  return template.evaluate();
}

// Function to retrieve survey questions
function getQuestions(sheetId) {
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheets()[0]; // Assume the questions are in the first sheet
  var data = sheet.getDataRange().getValues();
  var questions = [];
  
  // Assume the first column contains the questions
  for (var i = 0; i < data.length; i++) {
    questions.push(data[i][0]);
  }
  return questions;
}

function submitToSheet(questions, allResponses, userInfo) {
  var sheetId = "1uGBNzDdBm_94D9TWiiev7ZzmE0gjv6tbWPFdYQVg0no";  // Target Google Sheets ID
  var sheet = SpreadsheetApp.openById(sheetId);

  var sheetName = sheetId.slice(-5);  // Extract the last 5 characters for the sheet name
  var dataSheet = sheet.getSheetByName(sheetName);

  // Create the sheet and add headers if it doesn't exist
  if (!dataSheet) {
    dataSheet = sheet.insertSheet(sheetName);
    var headers = [];

    // Determine the maximum number of questions
    var maxQuestions = Math.max(...allResponses.map(r => r.length));

    headers.push("UserID");
    for (var i = 0; i < questions.length; ++i) {
      headers.push(questions[i]);
    }
    Logger.log("Headers length: " + headers.length);

    // Add user information columns
    headers.push('Gender', 'Age', 'Education Level');
    dataSheet.appendRow(headers);
  }

  // Iterate through all responses and store them row by row
  allResponses.forEach(response => {
    var row = response.slice();  // Copy response data
    row.push(userInfo.gender, userInfo.age, userInfo.education);  // Append user details
    dataSheet.appendRow(row);
  });
}
