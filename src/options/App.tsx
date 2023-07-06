import React, { useEffect, useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [
    isHideExploreRepositories,
    setIsHideExploreRepositories,
  ] = useState(false);
  const [
    isHideSponsors,
    setIsHideSponsors,
  ] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get([
      'isHideExploreRepositories',
      'isHideSponsors',
    ]).then((keys): void => {
      setIsHideExploreRepositories(
        keys.isHideExploreRepositories,
      );
      setIsHideSponsors(keys.isHideSponsors);
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <form>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideExploreRepositories}
            aria-describedby='help-text-for-isHideExploreRepositories-checkbox'
            onChange={(_ev) => {
              const toggled = !isHideExploreRepositories;
              setIsHideExploreRepositories(
                toggled,
              );
              chrome.storage.sync.set({
                'isHideExploreRepositories': toggled,
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
          className='note'
          id='help-text-for-isHideExploreRepositories-checkbox'
        >
          Hide the section in right-sidebar if enabled this option
        </p>
      </div>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsors}
            aria-describedby='help-text-for-isHideSponsors-checkbox'
            onChange={(_ev) => {
              const toggled = !isHideSponsors;
              setIsHideSponsors(
                toggled,
              );
              chrome.storage.sync.set({
                'isHideSponsors': toggled,
              }).then(() => {
                console.log(
                  `isHideSponsors is set to ${toggled}`,
                );
              });
            }}
          />
          Hide "Sponsors"
        </label>
        <p
          className='note'
          id='help-text-for-isHideSponsors-checkbox'
        >
          Hide the section in left-sidebar if enabled this option
        </p>
      </div>
    </form>
  );
}

export default App;
