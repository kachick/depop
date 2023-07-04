import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [
    isEnableExploreRepositoriesSideBar,
    setIsEnableExploreRepositoriesSideBar,
  ] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get([
      "isEnableExploreRepositoriesSideBar",
    ]).then((keys) =>
      setIsEnableExploreRepositoriesSideBar(
        keys.isEnableExploreRepositoriesSideBar,
      )
    ).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div>
      <label htmlFor="isEnableExploreRepositoriesSideBar">
        Explore repositories
      </label>
      <input
        id="isEnableExploreRepositoriesSideBar"
        type="checkbox"
        checked={isEnableExploreRepositoriesSideBar}
        onChange={(_ev) => {
          const toggled = !isEnableExploreRepositoriesSideBar;
          setIsEnableExploreRepositoriesSideBar(
            toggled,
          );
          chrome.storage.sync.set({
            "isEnableExploreRepositoriesSideBar": toggled,
          }).then(() => {
            console.log(
              `isEnableExploreRepositoriesSideBar is set to ${toggled}`,
            );
          });
        }}
      />
    </div>
  );
}

export default App;
