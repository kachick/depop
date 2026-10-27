## Architecture Decisions

### Global Toggle Strategy (ADR 001)

We provide a global "ON/OFF" switch in the extension popup that updates GitHub pages immediately.

#### The Problem

Chrome extensions (Manifest V3) do not have a simple API to "unload" content scripts once they are injected.

#### The Decision

We use a **CSS-class-based toggle** approach:

1. Wrap all CSS rules in `github-patcher.css` under a `.depop-enabled` class on the `<html>` or `<body>` element.
2. The `github-patcher.ts` listens for storage changes and toggles this class on the `<html>` element as early as possible (`document_start`).

#### Why?

- **Instant update**: The browser's CSS engine updates the page immediately.
- **Minimal Lag**: Applying the class to the `<html>` element at `document_start` ensures that elements are hidden before they are even rendered.
- **SPA Compatibility**: The `<html>` element's class persists during GitHub's Turbo (SPA) transitions, maintaining the hidden state.
- **Performance**: High performance with minimal reflow.
