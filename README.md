# depop

[![CI](https://github.com/kachick/depop/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/depop/actions/workflows/ci.yml?query=event%3Apush++)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/bblbchjekobacogfioehogggccfagkmk?style=flat&logo=googlechrome&color=%231a73e8)](https://chromewebstore.google.com/detail/depop/bblbchjekobacogfioehogggccfagkmk)

A Chrome Extension to hide stars, followers, watchers, sponsors, and other stats on GitHub

![Screen Shot](assets/screenshots/overview.png)

## Why?

I don't want my heart to be disturbed by the "±", especially during coding and research.

## Installation

Choose one of the following options.

- Visit [Chrome Web Store](https://chromewebstore.google.com/detail/depop/bblbchjekobacogfioehogggccfagkmk)
- Download stable zip archive from [release page](https://github.com/kachick/depop/releases) and load it from `chrome://extensions/`.
- Download unstable zip archive from the [uploaded artifacts](https://github.com/kachick/depop/actions/workflows/ci.yml?query=branch%3Amain+is%3Asuccess). And use it same as stable.
- [Run build task](CONTRIBUTING.md) and load "./dist" folder as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

## Usage

By default, stars are hidden as much as possible.\
Some features can be hidden by enabling them on the [Options page](https://developer.chrome.com/docs/extensions/mv3/options/).\
If you installed it with Google Web Store, the URL should be `chrome-extension://bblbchjekobacogfioehogggccfagkmk/options.html`

![Screen Shot](assets/screenshots/options.png)

## Suppressible GitHub stats

- User
- Repository index
- Repository detail
- Pinned Repositories
- "Explore repositories" and/or the stars
- Sponsors
- Sponsoring
- Achievements
- Highlights

### Suppressible third party stats

- [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)

## Inspired

While digging into this feature, I noticed that
[rentzsch/unpopular](https://github.com/rentzsch/unpopular/tree/863963e26c1a758a53eb33747e0fec6f26ac130d)
exists.\
The way looks simple and reasonable to me, it just apply CSS without any
JavaScript.\
However, I started this project from below reasons.

- Applying CSS doesn't work with the current GitHub WebUI
- There is no activity in these 8 years
- It uses manifest version2.
  [Google will disable it with version3](https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/).
- I want to focus on GitHub, would not consider around Twitter
