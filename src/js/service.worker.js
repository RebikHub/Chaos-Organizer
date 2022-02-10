/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { precacheAndRoute } from 'workbox-precaching';

const myPlugin = {
  fetchDidSucceed: async ({ response }) => {
    if (response.ok) {
      return response;
    }
    throw new Error(`${response.status} ${response.statusText}`);
  },
};

registerRoute(
  ({ url }) => url.pathname.startsWith('/'),
  new NetworkFirst({
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/news'),
  new NetworkFirst({
    plugins: [
      myPlugin,
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

precacheAndRoute(self.__WB_MANIFEST);
