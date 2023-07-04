import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [
    isHideExploreRepositories,
    setIsHideExploreRepositories,
  ] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get([
      "isHideExploreRepositories",
    ]).then((keys) =>
      setIsHideExploreRepositories(
        keys.isHideExploreRepositories,
      )
    ).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div>
      <label htmlFor="isHideExploreRepositories">
        Hide <strong>Explore repositories</strong>
      </label>
      <input
        id="isHideExploreRepositories"
        type="checkbox"
        checked={isHideExploreRepositories}
        onChange={(_ev) => {
          const toggled = !isHideExploreRepositories;
          setIsHideExploreRepositories(
            toggled,
          );
          chrome.storage.sync.set({
            "isHideExploreRepositories": toggled,
          }).then(() => {
            console.log(
              `isHideExploreRepositories is set to ${toggled}`,
            );
          });
        }}
      />
    </div>
  );
}

export default App;
