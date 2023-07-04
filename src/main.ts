const hide = (element: Element): void => {
  element.setAttribute(
    // Prefer hidden rather than display:none https://primer.style/css/utilities/layout#the-html-hidden-attribute
    "hidden",
    // Both `true` and `false` will be interpreted as `true`.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
    "true",
  );
};

chrome.storage.sync.get([
  "isHideExploreRepositories",
  "isHideSponsors",
]).then((keys): void => {
  if (keys.isHideExploreRepositories) {
    const exploreRepositoriesComponent = document.querySelector(
      "div[aria-label='Explore repositories']",
    );

    if (exploreRepositoriesComponent) {
      hide(exploreRepositoriesComponent);
    }
  }

  if (keys.isHideSponsors) {
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
  }
});
