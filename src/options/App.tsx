// deno-lint-ignore no-unused-vars
import * as React from 'https://esm.sh/react@19.0.0?target=es2022'; // Load whole `React` to avoid no reference, if omitting, should check options page manually
import { useEffect, useState } from 'https://esm.sh/react@19.0.0?target=es2022';

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
  const [
    isHideSponsoring,
    setIsHideSponsoring,
  ] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get([
      'isHideExploreRepositories',
      'isHideSponsors',
      'isHideSponsoring',
    ]).then((keys): void => {
      setIsHideExploreRepositories(
        keys.isHideExploreRepositories,
      );
      setIsHideSponsors(keys.isHideSponsors);
      setIsHideSponsoring(keys.isHideSponsoring);
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
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsoring}
            aria-describedby='help-text-for-isHideSponsoring-checkbox'
            onChange={(_ev) => {
              const toggled = !isHideSponsoring;
              setIsHideSponsoring(
                toggled,
              );
              chrome.storage.sync.set({
                'isHideSponsoring': toggled,
              }).then(() => {
                console.log(
                  `isHideSponsoring is set to ${toggled}`,
                );
              });
            }}
          />
          Hide "Sponsoring"
        </label>
        <p
          className='note'
          id='help-text-for-isHideSponsoring-checkbox'
        >
          Hide the section in left-sidebar if enabled this option
        </p>
      </div>
    </form>
  );
}

export default App;
