# Bildermappe

Open Source 3d Editor for positions in sports, especially formation dancing.

[Open Editor](https://fellmann.github.io/bildermappe)

## Design Principles

- Mobile first: Optimized for usage on mobile touch only devices.
- Offline first: No internet connection needed - PWA with service worker, supports local installation. No web service needed, all data is stored on device.
- Easy data sharing: Files can be exportet as *.txt file with plain JSON content and shared with others using any kind of messenger.
- Data privacy: All data never leaves the local device.
- Performance: High efficiency in rendering and low battery usage by avoiding useless rendering and optimized state management
- Focus on modern devices: Legacy browsers are not fully supported in favor of modern browser features.

## Technologies

Based on:
- [TypeScript](https://github.com/microsoft/typescript)
- [React](https://github.com/facebook/react)
- [MUI](https://github.com/mui-org/material-ui)
- [three.js](https://github.com/mrdoob/three.js)
- [zustand](https://github.com/pmndrs/zustand)
- [Parcel](https://github.com/parcel-bundler/parcel)
- [Workbox](https://github.com/GoogleChrome/workbox)


# Contributing

Prerequisites: Node >= 16, Yarn installed

Run locally:
1. Run `yarn`
2. Run `yarn start`, open https://localhost:1234

Build: Run `yarn build`

Contributions are welcome.
