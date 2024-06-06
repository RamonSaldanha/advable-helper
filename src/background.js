chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});

const reloadTxtPath = 'reload.txt';

let lastReloadTime = null;

function checkForReload() {
  fetch(chrome.runtime.getURL(reloadTxtPath))
    .then(response => response.text())
    .then(text => {
      if (lastReloadTime && lastReloadTime !== text) {
        chrome.runtime.reload();
      }
      lastReloadTime = text;
    })
    .catch(error => console.error('Error checking reload:', error));
}

setInterval(checkForReload, 1000);










chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  }
});

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // console.log({ tab });
  return tab;
}

async function getCurrentRoot() {
  const tab = await getCurrentTab();
  const url = new URL(tab.url);
  return url.origin;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "POPUP_INIT":
      getCurrentTab().then(sendResponse);
      return true;
    case "GET_HTML_CONTENT":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "GET_HTML_CONTENT" },
          function (response) {
            sendResponse(response);
          },
        );
      });
      return true; // Isso mantém o canal de mensagens aberto para a resposta assíncrona
    case "GET_CURRENT_ROOT":
      getCurrentRoot().then(sendResponse);
      return true;
    
      default:
      break;
  }
});
