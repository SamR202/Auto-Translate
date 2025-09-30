let processedDomains = {};

// Load saved domains on startup
chrome.storage.local.get(['processedDomains'], (data) => {
  if (data.processedDomains) {
    processedDomains = data.processedDomains;
    console.log('Loaded processed domains:', Object.keys(processedDomains).length);
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.action === 'checkDomain' && sender.tab?.url) {
      const hostname = new URL(sender.tab.url).hostname;
      const shouldProcess = !!processedDomains[hostname];
      console.log(`Domain check for ${hostname}: ${shouldProcess ? 'remembered' : 'new'}`);
      sendResponse({ shouldProcess });
    }
    
    if (message.action === 'saveDomain' && sender.tab?.url) {
      const hostname = new URL(sender.tab.url).hostname;
      processedDomains[hostname] = {
        added: Date.now(),
        lastProcessed: Date.now()
      };
      
      chrome.storage.local.set({ processedDomains }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save domain:', chrome.runtime.lastError);
        } else {
          console.log(`Domain saved: ${hostname}`);
        }
      });
      
      sendResponse({ success: true });
    }
    
    if (message.action === 'getDomains') {
      sendResponse({ domains: processedDomains });
    }
    
  } catch (error) {
    console.error('Background script error:', error);
    sendResponse({ error: error.message });
  }
  
  return true; // Keep message channel open for async responses
});

// Handle extension icon click (optional - for debugging)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension clicked on:', tab.url);
  console.log('Processed domains:', Object.keys(processedDomains));
});
