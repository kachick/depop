const exploreRepositoriesSideBar = document.querySelector(
  "div[aria-label='Explore repositories']",
);

if (exploreRepositoriesSideBar) {
  chrome.storage.sync.get([
    "isHideExploreRepositories",
  ]).then((keys) => {
    // Prefer hidden rather than display:none https://primer.style/css/utilities/layout#the-html-hidden-attribute
    if (keys.isHideExploreRepositories) {
      exploreRepositoriesSideBar.setAttribute(
        "hidden",
        // Both `true` and `false` will be interpreted as `true`.
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden
        "true",
      );
    }
  });
}
