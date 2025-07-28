import * as React from 'https://esm.sh/react@19.0.14?target=es2022'; // Load whole `React` to avoid no reference, if omitting, should check options page manually
import ToggleSettings from '../shared/ToggleSettings.tsx';

function App() {
  return (
    <ToggleSettings
      showDescriptions={true}
      showConsoleLog={true}
      loadingText='...Loading'
    />
  );
}

export default App;
