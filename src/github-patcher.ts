const markSection = (
  selectorXPath: string,
  sectionName: string,
  parentLevel: 1 | 2,
): void => {
  // CSS cannot select by text content (e.g. <h2>Sponsors</h2>), so XPath finds the node.
  // JS only adds a data attribute; CSS handles display: none for unified styling.
  const h2Node = document.evaluate(
    selectorXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const targetComponent = parentLevel === 2
    ? h2Node?.parentElement?.parentElement
    : h2Node?.parentElement;

  if (targetComponent && !targetComponent.hasAttribute('data-depop-section')) {
    targetComponent.setAttribute('data-depop-section', sectionName);
  }
};

const markSections = (): void => {
  // JS based DOM manipulation requires document.body and readyState != 'loading'
  if (!document.body || document.readyState === 'loading') {
    return;
  }

  // Sponsors: Received from
  markSection(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsors']",
    'sponsors',
    2,
  );
  // Sponsoring: Paid for
  markSection(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsoring']",
    'sponsoring',
    2,
  );
  // Highlights
  markSection(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Highlights']",
    'highlights',
    1,
  );
};

const updateComponents = (): void => {
  chrome.storage.sync.get([
    'isEnabled',
    'isHideSponsors',
    'isHideSponsoring',
  ]).then(
    ({ isEnabled, isHideSponsors, isHideSponsoring }): void => {
      // Default to true if not set
      const enabled = isEnabled !== false;

      document.documentElement.classList.toggle('depop-enabled', enabled);
      document.documentElement.classList.toggle(
        'depop-hide-sponsors',
        enabled && Boolean(isHideSponsors),
      );
      document.documentElement.classList.toggle(
        'depop-hide-sponsoring',
        enabled && Boolean(isHideSponsoring),
      );

      markSections();
    },
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('readystatechange', updateComponents, {
    passive: true,
  });
}
updateComponents();

// Listen for storage changes to apply options immediately without refresh
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    // Re-update if any of our keys might have changed
    const keys = ['isEnabled', 'isHideSponsors', 'isHideSponsoring'];
    if (keys.some((key) => Object.prototype.hasOwnProperty.call(changes, key))) {
      updateComponents();
    }
  }
});
