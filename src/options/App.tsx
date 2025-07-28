import * as React from 'https://esm.sh/react@19.0.0?target=es2022'; // Load whole `React` to avoid no reference, if omitting, should check options page manually
import { useEffect, useState } from 'https://esm.sh/react@19.0.0?target=es2022';

function App() {
  const [isLoading, startLoading] = React.useTransition();
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
        'isHideSponsors',
        'isHideSponsoring',
      ]);
      setIsHideSponsors(keys.isHideSponsors);
      setIsHideSponsoring(keys.isHideSponsoring);
    });
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
