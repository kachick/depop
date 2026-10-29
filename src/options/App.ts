import { createSignal, onCleanup, onMount } from 'solid-js';
import h from 'solid-js/h';

function App() {
  const [
    isLoading,
    setIsLoading,
  ] = createSignal(true);
  const [
    isEnabled,
    setIsEnabled,
  ] = createSignal(true);
  const [
    isHideSponsors,
    setIsHideSponsors,
  ] = createSignal(false);
  const [
    isHideSponsoring,
    setIsHideSponsoring,
  ] = createSignal(false);

  onMount(() => {
    const updateFromStorage = async () => {
      const keys = await chrome.storage.sync.get([
        'isEnabled',
        'isHideSponsors',
        'isHideSponsoring',
      ]);
      setIsEnabled(keys.isEnabled !== false);
      setIsHideSponsors(Boolean(keys.isHideSponsors));
      setIsHideSponsoring(Boolean(keys.isHideSponsoring));
      setIsLoading(false);
    };

    updateFromStorage();

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === 'sync') {
        if (changes.isEnabled) {
          setIsEnabled(changes.isEnabled.newValue !== false);
        }
        if (changes.isHideSponsors) {
          setIsHideSponsors(Boolean(changes.isHideSponsors.newValue));
        }
        if (changes.isHideSponsoring) {
          setIsHideSponsoring(Boolean(changes.isHideSponsoring.newValue));
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);

    onCleanup(() => {
      chrome.storage.onChanged.removeListener(listener);
    });
  });

  return () => {
    if (isLoading()) {
      return h('div', null, '...Loading');
    }

    return h('form', null, [
      h('div', { class: 'mb-3' }, [
        h('label', { class: 'toggle-switch' }, [
          h('input', {
            type: 'checkbox',
            checked: isEnabled,
            onChange: () => {
              const toggled = !isEnabled();
              setIsEnabled(toggled);
              chrome.storage.sync.set({ 'isEnabled': toggled });
            },
          }),
          h('span', { class: 'toggle-switch-track' }, [
            h('span', { class: 'toggle-switch-knob' }),
          ]),
          h('span', { class: 'toggle-switch-label' }, 'Enable depop'),
        ]),
      ]),

      h('hr'),

      h(
        'div',
        {
          style: () => ({
            opacity: isEnabled() ? '1' : '0.5',
            'pointer-events': isEnabled() ? 'auto' : 'none',
          }),
        },
        [
          h('div', { class: 'form-checkbox' }, [
            h('label', null, [
              h('input', {
                type: 'checkbox',
                checked: isHideSponsors,
                disabled: () => !isEnabled(),
                'aria-label': 'Hide "Sponsors"',
                onChange: () => {
                  const toggled = !isHideSponsors();
                  setIsHideSponsors(toggled);
                  chrome.storage.sync.set({
                    'isHideSponsors': toggled,
                  });
                },
              }),
              'Hide "Sponsors"',
            ]),
          ]),
          h('div', { class: 'form-checkbox' }, [
            h('label', null, [
              h('input', {
                type: 'checkbox',
                checked: isHideSponsoring,
                disabled: () => !isEnabled(),
                'aria-label': 'Hide "Sponsoring"',
                onChange: () => {
                  const toggled = !isHideSponsoring();
                  setIsHideSponsoring(toggled);
                  chrome.storage.sync.set({
                    'isHideSponsoring': toggled,
                  });
                },
              }),
              'Hide "Sponsoring"',
            ]),
          ]),
        ],
      ),

      h('footer', { class: 'mt-3 pt-3 border-top color-fg-muted f6 text-right' }, [
        h(
          'a',
          {
            href: 'https://github.com/kachick/depop',
            target: '_blank',
            rel: 'noreferrer',
            class: 'Link--external',
          },
          'Source code',
        ),
        globalThis.location.pathname.endsWith('popup.html') && [
          ' · ',
          h(
            'button',
            {
              type: 'button',
              class: 'btn-link color-fg-muted',
              'aria-label': 'Open options',
              onClick: () => chrome.runtime.openOptionsPage(),
            },
            '⚙️',
          ),
        ],
      ]),
    ]);
  };
}

export default App;
