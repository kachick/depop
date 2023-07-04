const exploreRepositoriesSideBar = document.querySelector("div[aria-label='Explore repositories']");
if (exploreRepositoriesSideBar) {
    chrome.storage.sync.get([
        "isEnableExploreRepositoriesSideBar"
    ]).then((keys)=>{
        if (keys.isEnableExploreRepositoriesSideBar) {
            exploreRepositoriesSideBar.setAttribute("hidden", "true");
        }
    });
}

