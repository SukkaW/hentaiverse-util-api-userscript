import { callbackify } from '../util/callackify';
import { FetchQueue } from '../util/fetch-queue';
export const fetchQueue = new FetchQueue();

/**
 * According to the [Rules description](https://forums.e-hentai.org/index.php?showtopic=243549) by Nezu:
 * > Out of battle, rate limits are unspecified, but may be enforced automatically by the server resulting in a lockout (which prevents any further actions or page loads). Regularly triggering this limiter risks bans. Script writers should avoid using multiple connection threads for requests, or limit them to the same 4 per second maximum for the safety of users.
 *
 * In order to avoid stock limit ban caused by sending too much requests, it is recommended to use HVULAPI built-in fetch queue to send requests.
 * ```js
 * hv.fetchQueue.fetchAsync('?s=Bazaar&ss=es', { method: 'GET' })
 * ```
 */
export function fetchAsync(url: string, init?: RequestInit): Promise<Response> {
  return fetchQueue.add(url, init);
}

/**
 * Callbackify version of {@link fetchAsync}
 */
export const request = callbackify(fetchAsync);

/**
 * HVULAPI set a default max connections limit as `4`. However, since your users might have other userscripts installed (and those scripts might not be utilizing fetchQueue), it is still possible for them to reach the Rate Limit. HVULAPI provides a function for you to configure the max connections.
 *
 * ```js
 * hv.fetchQueue.setMaxNetworkConnections(2);
 * ```
 */
export function setMaxNetworkConnections(maxConnections: number): void {
  if (typeof maxConnections !== 'number') {
    throw new TypeError('parameter "maxConnections" must be type of Number!');
  }
  fetchQueue.setMaxConnections(maxConnections);
}
