document.addEventListener('DOMContentLoaded', async () => {
  const isEnabledCheckbox = document.querySelector('#isEnabled');
  const openOptionsBtn = document.querySelector('#openOptions');

  if (!(isEnabledCheckbox instanceof HTMLInputElement) || !openOptionsBtn) {
    return;
  }

  // Initial state
  const keys = await chrome.storage.sync.get(['isEnabled']);
  const initialEnabled = keys.isEnabled !== false;
  isEnabledCheckbox.checked = initialEnabled;
  console.log('depop popup initialized, isEnabled:', initialEnabled);

  // Toggle state
  isEnabledCheckbox.addEventListener('change', () => {
    const toggled = isEnabledCheckbox.checked;
    chrome.storage.sync.set({ isEnabled: toggled });
    console.log('depop isEnabled toggled to:', toggled);
  });

  // Open options page
  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
