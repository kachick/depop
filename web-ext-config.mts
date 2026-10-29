// https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
export default {
  sourceDir: 'dist/firefox',
  run: {
    startUrl: ['https://github.com/kachick/depop'],
    pref: [
      // Disable the onboarding/welcome screen on first launch to directly show startUrl
      'browser.aboutwelcome.enabled=false',
      'trailhead.firstrun.didSeeAboutWelcome=true',
      'browser.startup.page=1',
      'browser.startup.homepage_override.mstone=ignore',
    ],
  },
} as const;
