
document.addEventListener('DOMContentLoaded', () => {
    const useAuthCheckbox = document.getElementById('useAuth');
    const authFields = document.getElementById('authFields');
    const statusMessage = document.getElementById('statusMessage');
  
    chrome.storage.local.get('proxyConfig', (data) => {
      if (data.proxyConfig) {
        document.getElementById('proxyHost').value = data.proxyConfig.host || '';
        document.getElementById('proxyPort').value = data.proxyConfig.port || '';
        document.getElementById('username').value = data.proxyConfig.username || '';
        document.getElementById('password').value = data.proxyConfig.password || '';
        useAuthCheckbox.checked = data.proxyConfig.useAuth || false;
        authFields.style.display = useAuthCheckbox.checked ? 'block' : 'none';
      }
    });
  
    useAuthCheckbox.addEventListener('change', () => {
      authFields.style.display = useAuthCheckbox.checked ? 'block' : 'none';
    });
  
    document.getElementById('saveButton').addEventListener('click', () => {
      const config = {
        host: document.getElementById('proxyHost').value,
        port: document.getElementById('proxyPort').value,
        useAuth: useAuthCheckbox.checked,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      };
  
      chrome.storage.local.set({ proxyConfig: config }, () => {
        chrome.runtime.sendMessage({ type: 'updateProxy' });
        showStatus('Ayarlar kaydedildi!', 'success');
      });
    });
  
    document.getElementById('clearButton').addEventListener('click', () => {
      chrome.storage.local.remove('proxyConfig', () => {
        chrome.runtime.sendMessage({ type: 'clearProxy' });
        document.getElementById('proxyHost').value = '';
        document.getElementById('proxyPort').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        useAuthCheckbox.checked = false;
        authFields.style.display = 'none';
        showStatus('Ayarlar temizlendi!', 'success');
      });
    });
  
    function showStatus(message, type) {
      statusMessage.textContent = message;
      statusMessage.className = `status-message ${type}`;
      statusMessage.style.display = 'block';
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 3000);
    }
  });
  