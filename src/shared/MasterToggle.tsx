import * as React from 'https://esm.sh/react@19.0.0?target=es2022';

const { useEffect, useState } = React;

interface MasterToggleProps {
  loadingText?: string;
  showIndividualToggles?: boolean;
}

export default function MasterToggle({
  loadingText = 'Loading...',
  showIndividualToggles = false,
}: MasterToggleProps) {
  const [isLoading, startLoading] = React.useTransition();
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [isHideSponsors, setIsHideSponsors] = useState(false);
  const [isHideSponsoring, setIsHideSponsoring] = useState(false);

  useEffect(() => {
    startLoading(async () => {
      const keys = await chrome.storage.sync.get([
        'isExtensionEnabled',
        'isHideSponsors',
        'isHideSponsoring',
      ]);
      setIsExtensionEnabled(keys.isExtensionEnabled !== false); // Default to true
      setIsHideSponsors(keys.isHideSponsors);
      setIsHideSponsoring(keys.isHideSponsoring);
    });
  }, []);

  if (isLoading) {
    return <div>{loadingText}</div>;
  }

  const handleMasterToggle = () => {
    const toggled = !isExtensionEnabled;
    setIsExtensionEnabled(toggled);
    chrome.storage.sync.set({
      isExtensionEnabled: toggled,
    });
  };

  const handleIndividualToggle = (
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
      {/* Master Toggle */}
      <div
        className='form-checkbox'
        style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #d1d9e0' }}
      >
        <label style={{ fontWeight: '600', fontSize: '14px' }}>
          <input
            type='checkbox'
            checked={isExtensionEnabled}
            onChange={handleMasterToggle}
            style={{ marginRight: '8px' }}
          />
          {isExtensionEnabled ? 'Extension Enabled' : 'Extension Disabled'}
        </label>
        <div style={{ fontSize: '12px', color: '#656d76', marginTop: '4px', marginLeft: '20px' }}>
          {isExtensionEnabled ? 'Click to disable all hiding features' : 'Click to enable all hiding features'}
        </div>
      </div>

      {/* Individual Toggles (if enabled and master toggle is on) */}
      {showIndividualToggles && isExtensionEnabled && (
        <>
          <div className='form-checkbox'>
            <label>
              <input
                type='checkbox'
                checked={isHideSponsors}
                onChange={(_ev) =>
                  handleIndividualToggle(
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
                  handleIndividualToggle(
                    'isHideSponsoring',
                    isHideSponsoring,
                    setIsHideSponsoring,
                  )}
              />
              Hide "Sponsoring"
            </label>
          </div>
        </>
      )}

      {/* Disabled state message */}
      {showIndividualToggles && !isExtensionEnabled && (
        <div style={{ fontSize: '12px', color: '#656d76', fontStyle: 'italic', textAlign: 'center' }}>
          Individual settings are disabled when extension is off
        </div>
      )}
    </form>
  );
}
