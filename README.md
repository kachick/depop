# depop

[![CI](https://github.com/kachick/depop/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/kachick/depop/actions/workflows/ci.yml?query=event%3Apush++)

A Chrome Extension to hide stars, followers and watchers in GitHub

![Screen Shot](assets/screenshot-overview.png)

## Why?

I don't want my heart to be disturbed by the "±", especially during coding and research.

## Install

- [Chrome Web Store](https://chrome.google.com/webstore/detail/eyes-away-from-github-pop/bblbchjekobacogfioehogggccfagkmk)
- [Run build task](CONTRIBUTING.md) and [load this folder as an unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

## Usage

Stars will be hidden in default as possible or I know.\
Some features can be hidden if you enabled them in [options page](chrome-extension://cogagkopinhlfdndkndbpkbhahgjjfid/static/options.html).

## Covered GitHub features

- User
- Repository index
- Repository detail
- Pinned Repositories
- "Explore repositories" and/or the stars # Since 0.0.0.9
- Sponsors # Since 0.0.0.9

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
