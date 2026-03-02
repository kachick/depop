const updateIcon = (isEnabled: boolean): void => {
  const path = isEnabled
    ? 'icon-sadness-star.png'
    : 'icon-sadness-star-disabled.png';
  chrome.action.setIcon({
    path: {
      '128': path,
    },
  });
};

// Update icon on startup
chrome.storage.sync.get(['isEnabled'], (result) => {
  updateIcon(result.isEnabled !== false);
});

// Listen for changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.isEnabled) {
    updateIcon(changes.isEnabled.newValue !== false);
  }
});
