function doGet(e) {
  const formId = e.parameter.formId;
  const userId = e.parameter.userId;  
  const sheetId = '1aPiydXYtfzzecVks_EXNAYE_5JRlFqmEI3Gt6Uou_M8';  

  if (!formId) {
    return ContentService.createTextOutput("formId needed").setMimeType(ContentService.MimeType.TEXT);
  }

  // 打开 Google Sheet
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  let visitCount = 0;
  let userExists = false;
  let newUserId = "";

  if (userId) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === formId && data[i][1].toString().trim() === userId) {
        visitCount = data[i][2];  
        userExists = true; 
        break;
      }
    }
  } else {
    let maxId = 1000;  
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === formId) {
        maxId = Math.max(maxId, data[i][1]); 
      }
    }
    newUserId = maxId + 1;  
    visitCount = 1;  
  }
  Logger.log('user id ' + userId + ' visit ' + visitCount);
  
  if (userExists) {
    visitCount++;
    const rowIndex = data.findIndex(row => row[0] === formId && row[1].toString().trim() === userId);
    sheet.getRange(rowIndex + 1, 3).setValue(visitCount); 
    newUserId = `${userId}.${visitCount}`; 
    Logger.log('newuserid ' + newUserId);
  } 
  // else if (userId) {
  //   sheet.appendRow([formId, userId, visitCount]);
  //   newUserId = `${userId}.${visitCount}`; 
  //   Logger.log('newuserid ' + newUserId);
  // } 
  else {
    sheet.appendRow([formId, newUserId, visitCount]);
    newUserId = `${newUserId}.${visitCount}` ;
  }

  return ContentService.createTextOutput(newUserId).setMimeType(ContentService.MimeType.TEXT);
}


