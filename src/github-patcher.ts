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

const CSS_ID = 'depop-github-patcher-styles';

const injectCSS = (): void => {
  // Don't inject if already present
  if (document.getElementById(CSS_ID)) {
    return;
  }

  const cssText = `
/* Repository Header */
#repository-container-header .Counter,
/* Repository Sidebar */
/* NOTE: Might be matched when it has same naming repository, however current GitHub does not set any meaningful class and ID */
a[href$='/stargazers'],
a[href$='?tab=followers'],
a[href$='/network/members'],
/* Restrict with <strong> to keep the icon */
a[href$='/watchers'] strong,
a[href$='/forks'] strong,
/* Third party stats. "GitHub Readme Stats" */
/* NOTE: Do not hide other endpoints like api/top-langs */
a:has(> img[data-canonical-src^='https://github-readme-stats.vercel.app/api?']) {
  display: none;
}

/* Profile Sidebar */
li:has(> a[href$='/followers']),
div:has(> h2 a[href$='?tab=achievements']) {
  display: none !important;
}
  `;

  const styleElement = document.createElement('style');
  styleElement.id = CSS_ID;
  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
};

const removeCSS = (): void => {
  const existingStyle = document.getElementById(CSS_ID);
  if (existingStyle) {
    existingStyle.remove();
  }
};

const updateComponents = (): void => {
  chrome.storage.sync.get(['filterLevel']).then(
    ({ filterLevel }): void => {
      const level = filterLevel || FilterLevel.Default;
      
      switch (level) {
        case FilterLevel.Off:
          removeCSS();
          handleSponsors(false);
          handleSponsoring(false);
          handleHighlights(false);
          break;
        case FilterLevel.Default:
          injectCSS();
          handleSponsors(false);
          handleSponsoring(false);
          handleHighlights(true);
          break;
        case FilterLevel.Max:
          injectCSS();
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
