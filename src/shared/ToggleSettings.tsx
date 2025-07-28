import * as React from 'https://esm.sh/react@19.0.0?target=es2022';

const { useEffect, useState } = React;

interface ToggleSettingsProps {
  showDescriptions?: boolean;
  showConsoleLog?: boolean;
  loadingText?: string;
}

export default function ToggleSettings({
  showDescriptions = false,
  showConsoleLog = false,
  loadingText = 'Loading...',
}: ToggleSettingsProps) {
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
    return <div>{loadingText}</div>;
  }

  const handleToggle = (
    settingKey: string,
    currentValue: boolean,
    setter: (value: boolean) => void,
  ) => {
    const toggled = !currentValue;
    setter(toggled);
    const storagePromise = chrome.storage.sync.set({
      [settingKey]: toggled,
    });

    if (showConsoleLog) {
      storagePromise.then(() => {
        console.log(`${settingKey} is set to ${toggled}`);
      });
    }
  };

  return (
    <form>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsors}
            {...(showDescriptions && {
              'aria-describedby': 'help-text-for-isHideSponsors-checkbox',
            })}
            onChange={(_ev) =>
              handleToggle(
                'isHideSponsors',
                isHideSponsors,
                setIsHideSponsors,
              )}
          />
          Hide "Sponsors"
        </label>
        {showDescriptions && (
          <p
            className='note'
            id='help-text-for-isHideSponsors-checkbox'
          >
            Hide the section in left-sidebar if enabled this option
          </p>
        )}
      </div>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsoring}
            {...(showDescriptions && {
              'aria-describedby': 'help-text-for-isHideSponsoring-checkbox',
            })}
            onChange={(_ev) =>
              handleToggle(
                'isHideSponsoring',
                isHideSponsoring,
                setIsHideSponsoring,
              )}
          />
          Hide "Sponsoring"
        </label>
        {showDescriptions && (
          <p
            className='note'
            id='help-text-for-isHideSponsoring-checkbox'
          >
            Hide the section in left-sidebar if enabled this option
          </p>
        )}
      </div>
    </form>
  );
}
