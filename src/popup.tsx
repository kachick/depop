import { createRoot } from 'https://esm.sh/react-dom@19.0.0/client?target=es2022';
import * as React from 'https://esm.sh/react@19.0.0?target=es2022';
import { assertIsDefined } from './typeguards.ts';

const { useEffect, useState } = React;

function PopupApp() {
  const [isLoading, startLoading] = React.useTransition();
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
    startLoading(async () => {
      const keys = await chrome.storage.sync.get([
        'isHideExploreRepositories',
        'isHideSponsors',
        'isHideSponsoring',
      ]);
      setIsHideExploreRepositories(
        keys.isHideExploreRepositories,
      );
      setIsHideSponsors(keys.isHideSponsors);
      setIsHideSponsoring(keys.isHideSponsoring);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideExploreRepositories}
            onChange={(_ev) => {
              const toggled = !isHideExploreRepositories;
              setIsHideExploreRepositories(toggled);
              chrome.storage.sync.set({
                'isHideExploreRepositories': toggled,
              });
            }}
          />
          Hide "Explore repositories"
        </label>
      </div>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsors}
            onChange={(_ev) => {
              const toggled = !isHideSponsors;
              setIsHideSponsors(toggled);
              chrome.storage.sync.set({
                'isHideSponsors': toggled,
              });
            }}
          />
          Hide "Sponsors"
        </label>
      </div>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsoring}
            onChange={(_ev) => {
              const toggled = !isHideSponsoring;
              setIsHideSponsoring(toggled);
              chrome.storage.sync.set({
                'isHideSponsoring': toggled,
              });
            }}
          />
          Hide "Sponsoring"
        </label>
      </div>
    </form>
  );
}

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);