// https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
module.exports = {
  sourceDir: 'dist/firefox',
  run: {
    startUrl: ['https://github.com/kachick/depop'],
    pref: [
      // Pin the extension button to the main toolbar (nav-bar) on startup instead of hiding it inside the extensions menu.
      'browser.uiCustomization.state=' + JSON.stringify({
        placements: {
          'widget-overflow-fixed-list': [],
          'unified-extensions-area': [],
          'nav-bar': [
            'back-button',
            'forward-button',
            'stop-reload-button',
            'urlbar-container',
            'unified-extensions-button',
            'depop_kachick_github_com-browser-action',
          ],
        },
        currentVersion: 20,
      }),
    ],
  },
};
