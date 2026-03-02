document.addEventListener('DOMContentLoaded', async () => {
  const isEnabledCheckbox = document.querySelector('#isEnabled');
  const openOptionsBtn = document.querySelector('#openOptions');

  if (!(isEnabledCheckbox instanceof HTMLInputElement) || !openOptionsBtn) {
    return;
  }

  // Initial state
  const keys = await chrome.storage.sync.get(['isEnabled']);
  isEnabledCheckbox.checked = keys.isEnabled !== false;

  // Toggle state
  isEnabledCheckbox.addEventListener('change', async () => {
    await chrome.storage.sync.set({ isEnabled: isEnabledCheckbox.checked });
  });

  // Open options page
  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
