const updateIcon = (isEnabled: boolean): void => {
  const suffix = isEnabled ? '' : '-disabled';
  chrome.action.setIcon({
    path: {
      '16': `icon-16${suffix}.png`,
      '32': `icon-32${suffix}.png`,
      '48': `icon-48${suffix}.png`,
      '128': `icon-128${suffix}.png`,
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
