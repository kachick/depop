const exploreRepositoriesSideBar = document.querySelector("div[aria-label='Explore repositories']");
if (exploreRepositoriesSideBar) {
    chrome.storage.sync.get([
        "isHideExploreRepositories"
    ]).then((keys)=>{
        if (keys.isHideExploreRepositories) {
            exploreRepositoriesSideBar.setAttribute("hidden", "true");
        }
    });
}

