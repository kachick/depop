import { createRoot } from 'https://esm.sh/react-dom@19.0.0/client?target=es2022';
import * as React from 'https://esm.sh/react@19.0.0?target=es2022';
import { useEffect, useState } from 'https://esm.sh/react@19.0.0?target=es2022';
import { assertIsDefined } from './typeguards.ts';

function PopupApp() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, startLoading] = React.useTransition();

  useEffect(() => {
    startLoading(async () => {
      const keys = await chrome.storage.sync.get(['isEnabled']);
      setIsEnabled(keys.isEnabled !== false);
    });
  }, []);

  const handleToggle = async () => {
    const toggled = !isEnabled;
    setIsEnabled(toggled);
    await chrome.storage.sync.set({ isEnabled: toggled });
  };

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className='form-checkbox'>
      <label>
        <input
          type='checkbox'
          checked={isEnabled}
          onChange={handleToggle}
        />
        Enable depop
      </label>
      <p className='note'>
        Hide stars, followers, and other stats on GitHub
      </p>
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
