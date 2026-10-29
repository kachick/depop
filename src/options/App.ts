import van from 'vanjs-core';

const { a, button, div, footer, form, hr, input, label, span } = van.tags;

function App() {
  const isLoading = van.state(true);
  const isEnabled = van.state(true);
  const isHideSponsors = van.state(false);
  const isHideSponsoring = van.state(false);

  const updateFromStorage = async () => {
    const keys = await chrome.storage.sync.get([
      'isEnabled',
      'isHideSponsors',
      'isHideSponsoring',
    ]);
    isEnabled.val = keys.isEnabled !== false;
    isHideSponsors.val = Boolean(keys.isHideSponsors);
    isHideSponsoring.val = Boolean(keys.isHideSponsoring);
    isLoading.val = false;
  };

  updateFromStorage();

  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => {
    if (areaName === 'sync') {
      if (changes.isEnabled) {
        isEnabled.val = changes.isEnabled.newValue !== false;
      }
      if (changes.isHideSponsors) {
        isHideSponsors.val = Boolean(changes.isHideSponsors.newValue);
      }
      if (changes.isHideSponsoring) {
        isHideSponsoring.val = Boolean(changes.isHideSponsoring.newValue);
      }
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    if (isLoading.val) {
      return div('...Loading');
    }

    return form(
      div(
        { class: 'mb-3' },
        label(
          { class: 'toggle-switch' },
          input({
            type: 'checkbox',
            checked: isEnabled,
            onchange: (e) => {
              const target = e.target as HTMLInputElement;
              isEnabled.val = target.checked;
              chrome.storage.sync.set({ 'isEnabled': target.checked });
            },
          }),
          span({ class: 'toggle-switch-track' }, span({ class: 'toggle-switch-knob' })),
          span({ class: 'toggle-switch-label' }, 'Enable depop'),
        ),
      ),
      hr(),
      div(
        {
          style: () => `opacity: ${isEnabled.val ? '1' : '0.5'}; pointer-events: ${isEnabled.val ? 'auto' : 'none'};`,
        },
        div(
          { class: 'form-checkbox' },
          label(
            input({
              type: 'checkbox',
              checked: isHideSponsors,
              disabled: () => !isEnabled.val,
              'aria-label': 'Hide "Sponsors"',
              onchange: (e) => {
                const target = e.target as HTMLInputElement;
                isHideSponsors.val = target.checked;
                chrome.storage.sync.set({
                  'isHideSponsors': target.checked,
                });
              },
            }),
            'Hide "Sponsors"',
          ),
        ),
        div(
          { class: 'form-checkbox' },
          label(
            input({
              type: 'checkbox',
              checked: isHideSponsoring,
              disabled: () => !isEnabled.val,
              'aria-label': 'Hide "Sponsoring"',
              onchange: (e) => {
                const target = e.target as HTMLInputElement;
                isHideSponsoring.val = target.checked;
                chrome.storage.sync.set({
                  'isHideSponsoring': target.checked,
                });
              },
            }),
            'Hide "Sponsoring"',
          ),
        ),
      ),
      footer(
        { class: 'mt-3 pt-3 border-top color-fg-muted f6 text-right' },
        a(
          {
            href: 'https://github.com/kachick/depop',
            target: '_blank',
            rel: 'noreferrer',
            class: 'Link--external',
          },
          'Source code',
        ),
        // VanJS renders `false` as a text node, so `&&` cannot be used here.
        globalThis.location.pathname.endsWith('popup.html')
          ? [
            ' · ',
            button(
              {
                type: 'button',
                class: 'btn-link color-fg-muted',
                'aria-label': 'Open options',
                onclick: () => chrome.runtime.openOptionsPage(),
              },
              '⚙️',
            ),
          ]
          : null,
      ),
    );
  };
}

export default App;
