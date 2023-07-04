const exploreRepositoriesSideBar = document.querySelector("div[aria-label='Explore repositories']");
const hide = (element)=>{
    element.setAttribute("hidden", "true");
};
if (exploreRepositoriesSideBar) {
    chrome.storage.sync.get([
        "isHideExploreRepositories"
    ]).then((keys)=>{
        if (keys.isHideExploreRepositories) {
            hide(exploreRepositoriesSideBar);
        }
    });
}
const sponsorsH2Node = document.evaluate("/html/body//div[@class='Layout-sidebar']//h2[text()='Sponsors']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
const sponsorsComponent = sponsorsH2Node?.parentElement?.parentElement;
if (sponsorsComponent) {
    hide(sponsorsComponent);
}

