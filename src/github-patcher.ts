const hide = (element: Element): void => {
  element.setAttribute(
    // Prefer hidden rather than display:none https://primer.style/css/utilities/layout#the-html-hidden-attribute
    'hidden',
    // Both `true` and `false` will be interpreted as `true`.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
    'true',
  );
};

const show = (element: Element): void => {
  element.removeAttribute('hidden');
};

// Sponsor: Received from
const handleSponsors = (shouldHide: boolean): void => {
  const sponsorsH2Node = document.evaluate(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsors']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const sponsorsComponent = sponsorsH2Node?.parentElement?.parentElement;

  if (sponsorsComponent) {
    if (shouldHide) {
      hide(sponsorsComponent);
    } else {
      show(sponsorsComponent);
    }
  }
};

// Sponsoring: Paid for
const handleSponsoring = (shouldHide: boolean): void => {
  const sponsoring2Node = document.evaluate(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsoring']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const sponsoringComponent = sponsoring2Node?.parentElement?.parentElement;

  if (sponsoringComponent) {
    if (shouldHide) {
      hide(sponsoringComponent);
    } else {
      show(sponsoringComponent);
    }
  }
};

const handleHighlights = (shouldHide: boolean): void => {
  const highlightsH2Node = document.evaluate(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Highlights']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const highlightsComponent = highlightsH2Node?.parentElement;
  if (highlightsComponent) {
    if (shouldHide) {
      hide(highlightsComponent);
    } else {
      show(highlightsComponent);
    }
  }
};

enum FilterLevel {
  Off = 'off',
  Default = 'default',
  Max = 'max'
}

const updateComponents = (): void => {
  chrome.storage.sync.get(['filterLevel']).then(
    ({ filterLevel }): void => {
      const level = filterLevel || FilterLevel.Default;
      
      switch (level) {
        case FilterLevel.Off:
          handleSponsors(false);
          handleSponsoring(false);
          handleHighlights(false);
          break;
        case FilterLevel.Default:
          handleSponsors(false);
          handleSponsoring(false);
          handleHighlights(true);
          break;
        case FilterLevel.Max:
          handleSponsors(true);
          handleSponsoring(true);
          handleHighlights(true);
          break;
      }
    },
  );
};

if (document.readyState !== 'complete') {
  document.addEventListener('load', updateComponents, { passive: true });
}
updateComponents();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    if (changes.filterLevel) {
      updateComponents();
    }
  }
});
