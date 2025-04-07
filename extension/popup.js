
document.getElementById('openSheet').addEventListener('click', async () => {
  // Google Apps Script Web App URL
  const webAppUrl = "https://script.google.com/macros/s/AKfycbzehVVp9oHRgApmN8RqnrgclAH8bxOCi9B9zAeqUlKx3sq7831Qp1g0ZSm08DpfytIP/exec";
  document.getElementById('loadingSpinner').style.display = 'block';
  try {
    const response = await fetch(webAppUrl, { method: 'GET' });

    if (response.ok) {
      const newSheetUrl = await response.text();
      window.open(newSheetUrl, '_blank'); // open google sheet
    } else {
      alert("Failed to create Google Sheet");
    }
    document.getElementById('loadingSpinner').style.display = 'none';
  } catch (error) {
    console.error("Error calling Web App:", error);
    alert("Error occurred while creating the Google Sheet.");
  }
});



document.getElementById('convertToForm').addEventListener('click', async () => {
  try {
    // get current link of Google Sheet
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError));
        }
        resolve(tabs);
      });
    });

    const currentTab = tabs[0];
    const url = currentTab.url;

    if (!url.includes("docs.google.com/spreadsheets")) {
      alert("Current page must be Google Sheet！");
      return;
    }

    const sheetIdMatch = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      alert("cannot get ID of Google Sheet");
      return;
    }

    const sheetId = sheetIdMatch[1];
    const scriptURL = "https://script.google.com/macros/s/AKfycbyCUEDu6FgziVCp10NpF5bXl9GU7bk8hLEEk7K8OK48DhXdWolccnfZ-OKjorwyjb0NFQ/exec";

    const formURL = scriptURL + "?sheetId=" + sheetId;


    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(formURL)}&size=250x250`;
    window.open(qrCodeURL, '_blank');
    
    document.getElementById('loadingSpinner').style.display = 'none';
  } catch (error) {
    console.error("FAIL：", error);
    alert("Internal Error");
  }
});

document.getElementById('viewForms').addEventListener('click', () => {
  const formsURL = "https://docs.google.com/forms/";
  window.open(formsURL, '_blank');
});
