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

const HIDE_CSS_CONTENT = `
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
/* NOTE: Do not hide other endpoints like \`api/top-langs\` */
a:has(> img[data-canonical-src^='https://github-readme-stats.vercel.app/api?']) {
  display: none;
}

/* Profile Sidebar */
li:has(> a[href$='/followers']),
div:has(> h2 a[href$='?tab=achievements']) {
  display: none !important;
}
`;

const SHOW_CSS_CONTENT = `
/* Override static CSS to show elements when extension is off - using html prefix for higher specificity */
/* Repository Header */
html #repository-container-header .Counter,
/* Repository Sidebar */
html a[href$='/stargazers'],
html a[href$='?tab=followers'],
html a[href$='/network/members'],
/* Restrict with <strong> to keep the icon */
html a[href$='/watchers'] strong,
html a[href$='/forks'] strong,
/* Third party stats. "GitHub Readme Stats" */
html a:has(> img[data-canonical-src^='https://github-readme-stats.vercel.app/api?']) {
  display: revert;
}

/* Profile Sidebar */
html li:has(> a[href$='/followers']),
html div:has(> h2 a[href$='?tab=achievements']) {
  display: revert;
}
`;

let styleElement: HTMLStyleElement | null = null;

const injectHideCSS = (): void => {
  if (styleElement) {
    styleElement.remove();
  }
  styleElement = document.createElement('style');
  styleElement.textContent = HIDE_CSS_CONTENT;
  styleElement.id = 'depop-styles';
  document.head.appendChild(styleElement);
};

const injectShowCSS = (): void => {
  if (styleElement) {
    styleElement.remove();
  }
  styleElement = document.createElement('style');
  styleElement.textContent = SHOW_CSS_CONTENT;
  styleElement.id = 'depop-styles';
  document.head.appendChild(styleElement);
};

const removeCSS = (): void => {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
};

const updateComponents = (): void => {
  chrome.storage.sync.get(['filterLevel']).then(
    ({ filterLevel }): void => {
      const level = filterLevel || FilterLevel.Default;
      
      switch (level) {
        case FilterLevel.Off:
          // Inject CSS to override static CSS and show all elements
          injectShowCSS();
          handleSponsors(false);
          handleSponsoring(false);
          handleHighlights(false);
          break;
        case FilterLevel.Default:
          // Inject CSS to hide stats, show sponsors/sponsoring
          injectHideCSS();
          handleSponsors(false);
          handleSponsoring(false);
          handleHighlights(true);
          break;
        case FilterLevel.Max:
          // Inject CSS and hide all elements
          injectHideCSS();
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
