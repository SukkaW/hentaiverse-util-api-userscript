import { fetchQueue } from './fetchQueue';
import { logger } from '../util/logger';
import { callbackify } from '../util/callbackify';

/**
 * ```js
 * const inventory = await hv.itemInventory.getItemInventoryAsync();
 * console.log(inventory);
 * // {
 * //   Health Draught: 1000,
 * //   Health Potion: 1000,
 * //   ...
 * // }
 * ```
 */
export async function getItemInventoryAsync(): Promise<Record<string, number>> {
  const data: Record<string, number> = {};

  const pageHtml = (await (await fetchQueue.add('?s=Character&ss=it')).text());
  for (const match of pageHtml.matchAll(/>([\w\s]+?)<\/div><\/td><td>(\d+)<\/td>/gm)) {
    const item = match[1];
    const number = Number(match[2]);

    if (!isNaN(number)) {
      data[item] = number;
    } else {
      logger.error('#getItemInventory', `Amount of ${item} parsed as NaN!`, match);
    }
  }

  return data;
}

/**
 * Callbackify version of {@link getItemInventoryAsync}
 */
export const getItemInventory = callbackify(getItemInventoryAsync);
