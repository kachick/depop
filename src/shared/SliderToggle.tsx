import * as React from 'https://esm.sh/react@19.0.14?target=es2022';

const { useEffect, useState } = React;

// Define the three levels
export type FilterLevel = 0 | 1 | 2;

interface SliderToggleProps {
  loadingText?: string;
  showFooter?: boolean;
}

export default function SliderToggle({
  loadingText = 'Loading...',
  showFooter = false,
}: SliderToggleProps) {
  const [isLoading, startLoading] = React.useTransition();
  const [filterLevel, setFilterLevel] = useState<FilterLevel>(1);

  useEffect(() => {
    startLoading(async () => {
      const keys = await chrome.storage.sync.get([
        'isExtensionEnabled',
        'isHideSponsors',
        'isHideSponsoring',
      ]);
      
      // Determine current level based on stored settings
      if (keys.isExtensionEnabled === false) {
        setFilterLevel(0); // Min: Extension disabled
      } else if (keys.isHideSponsors && keys.isHideSponsoring) {
        setFilterLevel(2); // Max: All features enabled
      } else {
        setFilterLevel(1); // Mid: Default (only highlights hidden)
      }
    });
  }, []);

  if (isLoading) {
    return <div>{loadingText}</div>;
  }

  const getLevelSettings = (level: FilterLevel) => {
    switch (level) {
      case 0: // Min: Disable all features
        return {
          isExtensionEnabled: false,
          isHideSponsors: false,
          isHideSponsoring: false,
        };
      case 1: // Mid: Default (only highlights hidden)
        return {
          isExtensionEnabled: true,
          isHideSponsors: false,
          isHideSponsoring: false,
        };
      case 2: // Max: All features enabled
        return {
          isExtensionEnabled: true,
          isHideSponsors: true,
          isHideSponsoring: true,
        };
      default:
        return {
          isExtensionEnabled: true,
          isHideSponsors: false,
          isHideSponsoring: false,
        };
    }
  };

  const getLevelLabel = (level: FilterLevel) => {
    switch (level) {
      case 0:
        return 'Off'; // No filtering (like uBlock Origin)
      case 1:
        return 'Default'; // Optimal (default)
      case 2:
        return 'Max'; // Complete (all features)
      default:
        return 'Default';
    }
  };

  const getLevelDescription = (level: FilterLevel) => {
    switch (level) {
      case 0:
        return 'Show original GitHub UI';
      case 1:
        return 'Hide highlights only (recommended)';
      case 2:
        return 'Hide all: sponsors, sponsoring, highlights';
      default:
        return 'Hide highlights only (recommended)';
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value) as FilterLevel;
    setFilterLevel(newLevel);
    
    const settings = getLevelSettings(newLevel);
    chrome.storage.sync.set(settings);
  };

  const handleOptionsPageClick = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
          Filtering Mode
        </div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#0969da' }}>
          {getLevelLabel(filterLevel)}
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="range"
          min="0"
          max="2"
          value={filterLevel}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#d1d9e0',
            outline: 'none',
            appearance: 'none',
          }}
        />
        
        {/* Level indicators */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '4px',
          fontSize: '11px',
          color: '#656d76'
        }}>
          <span>Min</span>
          <span>Mid</span>
          <span>Max</span>
        </div>
      </div>

      {/* Description */}
      <div style={{ 
        fontSize: '12px', 
        color: '#656d76', 
        textAlign: 'center',
        marginBottom: '16px',
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {getLevelDescription(filterLevel)}
      </div>

      {/* Visual indicator similar to uBlock Origin */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: showFooter ? '16px' : '0'
      }}>
        <div style={{
          width: '120px',
          height: '8px',
          background: '#d1d9e0',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(filterLevel + 1) * 33.33}%`,
            height: '100%',
            background: filterLevel === 0 ? '#28a745' : filterLevel === 1 ? '#0969da' : '#0969da',
            borderRadius: '4px',
            transition: 'width 0.2s ease'
          }} />
        </div>
      </div>

      {/* Footer with options page link */}
      {showFooter && (
        <div style={{ 
          borderTop: '1px solid #d1d9e0',
          paddingTop: '12px',
          textAlign: 'center'
        }}>
          <button
            onClick={handleOptionsPageClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#0969da',
              fontSize: '12px',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            ⚙️ Options
          </button>
        </div>
      )}
    </div>
  );
}