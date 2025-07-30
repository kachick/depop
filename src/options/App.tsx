import * as React from 'https://esm.sh/react@19.0.0?target=es2022';

const { useEffect, useState } = React;

interface CheckboxSettingsProps {
  loadingText?: string;
}

export default function CheckboxSettings({
  loadingText = 'Loading...',
}: CheckboxSettingsProps) {
  const [isLoading, startLoading] = React.useTransition();
  const [isHideSponsors, setIsHideSponsors] = useState(false);
  const [isHideSponsoring, setIsHideSponsoring] = useState(false);

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
    chrome.storage.sync.set({
      [settingKey]: toggled,
    });
  };

  return (
    <form>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsors}
            onChange={(_ev) =>
              handleToggle(
                'isHideSponsors',
                isHideSponsors,
                setIsHideSponsors,
              )}
          />
          Hide "Sponsors"
        </label>
      </div>
      <div className='form-checkbox'>
        <label>
          <input
            type='checkbox'
            checked={isHideSponsoring}
            onChange={(_ev) =>
              handleToggle(
                'isHideSponsoring',
                isHideSponsoring,
                setIsHideSponsoring,
              )}
          />
          Hide "Sponsoring"
        </label>
      </div>
    </form>
  );
}