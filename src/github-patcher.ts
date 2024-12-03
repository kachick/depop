const hide = (element: Element): void => {
  element.setAttribute(
    // Prefer hidden rather than display:none https://primer.style/css/utilities/layout#the-html-hidden-attribute
    'hidden',
    // Both `true` and `false` will be interpreted as `true`.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
    'true',
  );
};

const hideExploreRepositories = (): void => {
  const exploreRepositoriesComponent = document.querySelector(
    "aside[aria-label='Explore'] div[aria-label='Explore repositories']",
  );

  if (exploreRepositoriesComponent) {
    hide(exploreRepositoriesComponent);
  }
};

// Sponsor: Received from
const hideSponsors = (): void => {
  const sponsorsH2Node = document.evaluate(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsors']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const sponsorsComponent = sponsorsH2Node?.parentElement?.parentElement;

  if (sponsorsComponent) {
    hide(sponsorsComponent);
  }
};

// Sponsoring: Paid for
const hideSponsoring = (): void => {
  const sponsoring2Node = document.evaluate(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsoring']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const sponsoringComponent = sponsoring2Node?.parentElement?.parentElement;

  if (sponsoringComponent) {
    hide(sponsoringComponent);
  }
};

const hideHighlights = (): void => {
  const highlightsH2Node = document.evaluate(
    "/html/body//div[@class='Layout-sidebar']//h2[text()='Highlights']",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;

  const highlightsComponent = highlightsH2Node?.parentElement;
  if (highlightsComponent) {
    hide(highlightsComponent);
  }
};

const hideComponents = (): void => {
  chrome.storage.sync.get([
    'isHideExploreRepositories',
    'isHideSponsors',
    'isHideSponsoring',
  ]).then(
    ({ isHideExploreRepositories, isHideSponsors, isHideSponsoring }): void => {
      if (isHideExploreRepositories) {
        hideExploreRepositories();
      }

      if (isHideSponsors) {
        hideSponsors();
      }

      if (isHideSponsoring) {
        hideSponsoring();
      }
    },
  );

  hideHighlights();
};

if (document.readyState !== 'complete') {
  document.addEventListener('load', hideComponents, { passive: true });
}
hideComponents();
