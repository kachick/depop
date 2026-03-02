import * as React from 'https://esm.sh/react@19.0.0?target=es2022'; // Load whole `React` to avoid no reference, if omitting, should check options page manually
import { useEffect, useState } from 'https://esm.sh/react@19.0.0?target=es2022';

function App() {
  const [isLoading, startLoading] = React.useTransition();
  const [
    isEnabled,
    setIsEnabled,
  ] = useState(true);
  const [
    isHideSponsors,
    setIsHideSponsors,
  ] = useState(false);
  const [
    isHideSponsoring,
    setIsHideSponsoring,
  ] = useState(false);

  useEffect(() => {
    const updateFromStorage = async () => {
      const keys = await chrome.storage.sync.get([
        'isEnabled',
        'isHideSponsors',
        'isHideSponsoring',
      ]);
      setIsEnabled(keys.isEnabled !== false);
      setIsHideSponsors(keys.isHideSponsors);
      setIsHideSponsoring(keys.isHideSponsoring);
    };

    startLoading(() => updateFromStorage());

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === 'sync') {
        if (changes.isEnabled) {
          setIsEnabled(changes.isEnabled.newValue !== false);
        }
        if (changes.isHideSponsors) {
          setIsHideSponsors(changes.isHideSponsors.newValue);
        }
        if (changes.isHideSponsoring) {
          setIsHideSponsoring(changes.isHideSponsoring.newValue);
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <form>
      <div className='mb-3'>
        <label className='toggle-switch'>
          <input
            type='checkbox'
            checked={isEnabled}
            onChange={(_ev) => {
              const toggled = !isEnabled;
              setIsEnabled(toggled);
              chrome.storage.sync.set({ 'isEnabled': toggled });
            }}
          />
          <span className='toggle-switch-track'>
            <span className='toggle-switch-knob' />
          </span>
          <span className='toggle-switch-label'>Enable depop</span>
        </label>
      </div>

      <hr />

      <div style={{ opacity: isEnabled ? 1 : 0.5, pointerEvents: isEnabled ? 'auto' : 'none' }}>
        <div className='form-checkbox'>
          <label>
            <input
              type='checkbox'
              checked={isHideSponsors}
              disabled={!isEnabled}
              aria-label='Hide "Sponsors"'
              onChange={(_ev) => {
                const toggled = !isHideSponsors;
                setIsHideSponsors(
                  toggled,
                );
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
              disabled={!isEnabled}
              aria-label='Hide "Sponsoring"'
              onChange={(_ev) => {
                const toggled = !isHideSponsoring;
                setIsHideSponsoring(
                  toggled,
                );
                chrome.storage.sync.set({
                  'isHideSponsoring': toggled,
                });
              }}
            />
            Hide "Sponsoring"
          </label>
        </div>
      </div>

      <footer className='mt-3 pt-3 border-top color-fg-muted f6'>
        <a
          href='https://github.com/kachick/depop'
          target='_blank'
          rel='noreferrer'
          className='Link--external'
        >
          Source code
        </a>
        {globalThis.location.pathname.endsWith('popup.html') && (
          <>
            {' · '}
            <button
              type='button'
              className='btn-link color-fg-muted'
              aria-label='Open options'
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              ⚙️
            </button>
          </>
        )}
      </footer>
    </form>
  );
}

export default App;
