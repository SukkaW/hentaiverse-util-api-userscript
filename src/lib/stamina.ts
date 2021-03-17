import { logger } from '../util/logger';
import { fetchQueue } from './fetchQueue';

/**
 * Read and return current stamina. Return `null` when in-battle (`#stamina_readout` element just doesn't exist).
 *
 * ```js
 * hv.stamina.getStamina();
 * // 79
 * ```
 */
export function getStamina(): number | null {
  const staminaReadOutEl = document.getElementById('stamina_readout');
  if (staminaReadOutEl) {
    const staminaMatches = staminaReadOutEl.textContent?.match(/\d+/);

    if (staminaMatches) {
      const result = Number(staminaMatches);
      if (!isNaN(result)) {
        return result;
      }

      logger.warn('Fail to match number from #stamina_readout element. Return null.');
    }
  } else {
    logger.warn('Can\'t find #stamina_readout element. Return null.');
  }

  return null;
}
