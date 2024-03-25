const hide = (element: Element): void => {
  element.setAttribute(
    // Prefer hidden rather than display:none https://primer.style/css/utilities/layout#the-html-hidden-attribute
    'hidden',
    // Both `true` and `false` will be interpreted as `true`.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
    'true',
  );
};

const main = (): void => {
  console.log(`executed main`);
  chrome.storage.sync.get([
    'isHideExploreRepositories',
    'isHideSponsors',
  ]).then((keys): void => {
    console.log(`executed callback`);
    if (keys.isHideExploreRepositories) {
      const exploreRepositoriesComponent = document.querySelector(
        "div[aria-label='Explore repositories']",
      );

      if (exploreRepositoriesComponent) {
        hide(exploreRepositoriesComponent);
      }

      console.log(`executed isHideExploreRepositories`);
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

      console.log(`executed isHideSponsors`);
    }
  });

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
  console.log(`finished main`);
};

if (document.readyState !== 'complete') {
  document.addEventListener('load', main, { passive: true });
}
main();
