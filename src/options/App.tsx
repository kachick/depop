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
    <form>
      <div className="form-checkbox">
        <label>
          <input
            type="checkbox"
            checked={isHideExploreRepositories}
            aria-describedby="help-text-for-isHideExploreRepositories-checkbox"
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
          Hide "Explore repositories"
        </label>
        <p
          className="note"
          id="help-text-for-isHideExploreRepositories-checkbox"
        >
          Hide the whole component in sidebar if enabled this option
        </p>
      </div>
    </form>
  );
}

export default App;
