chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { toggleVisible: true });
  }
});

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log({ tab });
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
