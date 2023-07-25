chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onActivated.addListener(async info => {
    const tab = await chrome.tabs.get(info.tabId);

    const isFactorial = tab.url.startsWith('https://app.factorialhr.com/') || tab.url.startsWith('https://api.factorialhr.com/')
    isFactorial
        ? chrome.action.enable(tab.tabId)
        : chrome.action.disable(tab.tabId);
  });
});
