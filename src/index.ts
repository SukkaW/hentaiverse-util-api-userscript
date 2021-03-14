import { FetchQueue } from './util/fetch-queue';
import { logger } from './util/logger';

export const version = '0.0.1';

export const fetchQueue = new FetchQueue();

export function setMaxNetworkConnections(maxConnections: number): void {
  if (typeof maxConnections !== 'number') {
    throw new TypeError('parameter "maxConnections" must be type of Number!');
  }
  fetchQueue.setMaxConnections(maxConnections);
}

export { getStamina } from './lib/stamina';

logger.info('HentaiVerse User-Land API (HVULAPI) has loaded!');
logger.info('View documentation at https://github.com/SukkaW/hentaiverse-util-api-userscript');
