import { precacheAndRoute } from "workbox-precaching"

import { manifest, version } from "@parcel/service-worker"

precacheAndRoute(
  manifest.map((i) => ({
    url: i,
    revision: version,
  })),
  {}
)
