# Changelog

All notable changes to GazpachoScaler are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning: [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Content-Security-Policy meta tag in `client/index.html` — same baseline policy as the sibling repos, plus the Google Fonts hosts this app loads from (`fonts.googleapis.com`, `fonts.gstatic.com`) and `'unsafe-inline'` in `style-src` for Radix UI's inline positioning styles
- Root `CONTRIBUTING.md` pointing at [docs/contributing.md](docs/contributing.md), and this `CHANGELOG.md` (tooling parity with gazpachator-bolt)

### Changed

- CI now runs `pnpm test:coverage` instead of `pnpm test`, so the 80/75/80/80 coverage thresholds are actually enforced on every PR; `actions/upload-artifact` bumped v4 → v7 to match the sibling repos
