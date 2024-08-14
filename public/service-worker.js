import { precacheAndRoute } from "workbox-precaching";
import { setCacheNameDetails } from "workbox-core";

setCacheNameDetails({
  prefix: "wgsl101",
  suffix: "v1",
});

precacheAndRoute(self.__WB_MANIFEST);
