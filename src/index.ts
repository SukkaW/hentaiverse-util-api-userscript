import { logger } from './util/logger';

export const VERSION = '0.0.1';

export type { FetchQueue } from './util/fetch-queue';

export * as debug from './util/logger';
export * as is from './lib/is';
export * as ui from './lib/ui';
export * as fetchQueue from './lib/fetchQueue';
export * as stamina from './lib/stamina';
export * as itemInventory from './lib/itemInventory';
export * as character from './lib/character';

if (GM?.info?.script?.name === 'HV User-Land API') {
  // Currently run in stand alone userscript
  logger.info('HentaiVerse User-Land API (HVULAPI) has loaded!');
  logger.info('View documentation at https://github.com/SukkaW/hentaiverse-util-api-userscript');
}
