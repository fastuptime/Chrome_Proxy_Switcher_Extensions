chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateProxy') {
      chrome.storage.local.get('proxyConfig', (data) => {
        if (data.proxyConfig && data.proxyConfig.host && data.proxyConfig.port) {
          try {
            const config = {
              mode: "fixed_servers",
              rules: {
                singleProxy: {
                  scheme: "http",
                  host: data.proxyConfig.host,
                  port: parseInt(data.proxyConfig.port, 10)
                },
                bypassList: ["localhost"]
              }
            };
  
            chrome.proxy.settings.set(
              {value: config, scope: 'regular'},
              () => {
                if (chrome.runtime.lastError) {
                  console.error('Proxy ayarları hatası:', chrome.runtime.lastError);
                  sendResponse({success: false, error: chrome.runtime.lastError.message});
                } else {
                  sendResponse({success: true});
                }
              }
            );
          } catch (error) {
            console.error('Proxy yapılandırma hatası:', error);
            sendResponse({success: false, error: error.message});
          }
        }
      });
    } else if (message.type === 'clearProxy') {
      try {
        chrome.proxy.settings.clear(
          {scope: 'regular'},
          () => {
            if (chrome.runtime.lastError) {
              console.error('Proxy temizleme hatası:', chrome.runtime.lastError);
              sendResponse({success: false, error: chrome.runtime.lastError.message});
            } else {
              sendResponse({success: true});
            }
          }
        );
      } catch (error) {
        console.error('Proxy temizleme hatası:', error);
        sendResponse({success: false, error: error.message});
      }
    }
    return true;
  });