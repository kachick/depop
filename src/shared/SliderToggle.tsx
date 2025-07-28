import * as React from 'https://esm.sh/react@19.0.0?target=es2022';

const { useEffect, useState } = React;

export enum FilterLevel {
  Off = 'off',
  Default = 'default', 
  Max = 'max'
}

interface SliderToggleProps {
  loadingText?: string;
}

export default function SliderToggle({
  loadingText = 'Loading...',
}: SliderToggleProps) {
  const [isLoading, startLoading] = React.useTransition();
  const [filterLevel, setFilterLevel] = useState<FilterLevel>(FilterLevel.Default);

  useEffect(() => {
    startLoading(async () => {
      const result = await chrome.storage.sync.get(['filterLevel']);
      setFilterLevel(result.filterLevel || FilterLevel.Default);
    });
  }, []);

  if (isLoading) {
    return <div>{loadingText}</div>;
  }

  const getLevelLabel = (level: FilterLevel) => {
    switch (level) {
      case FilterLevel.Off:
        return 'Off';
      case FilterLevel.Default:
        return 'Default';
      case FilterLevel.Max:
        return 'Max';
    }
  };

  const getLevelDescription = (level: FilterLevel) => {
    switch (level) {
      case FilterLevel.Off:
        return 'Show original GitHub UI';
      case FilterLevel.Default:
        return 'Hide highlights only (recommended)';
      case FilterLevel.Max:
        return 'Hide all: sponsors, sponsoring, highlights';
    }
  };

  const getSliderValue = (level: FilterLevel): number => {
    switch (level) {
      case FilterLevel.Off:
        return 0;
      case FilterLevel.Default:
        return 1;
      case FilterLevel.Max:
        return 2;
    }
  };

  const getFilterLevelFromSlider = (value: number): FilterLevel => {
    switch (value) {
      case 0:
        return FilterLevel.Off;
      case 1:
        return FilterLevel.Default;
      case 2:
        return FilterLevel.Max;
      default:
        return FilterLevel.Default;
    }
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = getFilterLevelFromSlider(parseInt(event.target.value));
    setFilterLevel(newLevel);
    chrome.storage.sync.set({ filterLevel: newLevel });
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
          type='range'
          min='0'
          max='2'
          value={getSliderValue(filterLevel)}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px',
            fontSize: '11px',
            color: '#656d76',
          }}
        >
          <span>Min</span>
          <span>Mid</span>
          <span>Max</span>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '12px',
          color: '#656d76',
          textAlign: 'center',
          marginBottom: '16px',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {getLevelDescription(filterLevel)}
      </div>

      {/* Visual indicator similar to uBlock Origin */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '8px',
            background: '#d1d9e0',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(getSliderValue(filterLevel) + 1) * 33.33}%`,
              height: '100%',
              background: getSliderValue(filterLevel) === 0 ? '#28a745' : '#0969da',
              borderRadius: '4px',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
