import { createRoot } from 'https://esm.sh/react-dom@19.0.0/client?target=es2022';
import * as React from 'https://esm.sh/react@19.0.0?target=es2022';
import { useEffect, useState } from 'https://esm.sh/react@19.0.0?target=es2022';
import { assertIsDefined } from './typeguards.ts';

function PopupApp() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const keys = await chrome.storage.sync.get(['isEnabled']);
      setIsEnabled(keys.isEnabled !== false);
      setIsLoading(false);
    })();
  }, []);

  const handleToggle = async () => {
    const toggled = !isEnabled;
    setIsEnabled(toggled);
    await chrome.storage.sync.set({ isEnabled: toggled });
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (isLoading) {
    return <div className='text-center p-3'>Loading...</div>;
  }

  return (
    <div className='Box color-shadow-small'>
      <div className='Box-header py-2 px-3'>
        <h3 className='Box-title text-normal'>depop</h3>
      </div>
      <div className='Box-body p-3'>
        <div className='form-checkbox mt-0 mb-3'>
          <label>
            <input
              type='checkbox'
              checked={isEnabled}
              onChange={handleToggle}
            />
            <span className='text-bold'>Enable depop</span>
          </label>
          <p className='note mb-0'>
            Hide GitHub stats
          </p>
        </div>
        <button
          type='button'
          className='btn btn-sm btn-block'
          onClick={openOptions}
        >
          Detailed Settings
        </button>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);
