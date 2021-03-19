import { callbackify } from '../util/callbackify';
import { logger } from '../util/logger';
import { getValue, setValue } from '../util/store';

const rMatchLevel = /^(.+) Lv\.(\d+)/;

export async function getDifficultyAsync(): Promise<string | null> {
  const storedDifficulty = await getValue('difficulty');
  const levelEl = document.getElementById('level_readout');

  if (levelEl) {
    const matches = levelEl.textContent?.match(rMatchLevel);
    if (matches) {
      const difficulty = matches[1];

      if (difficulty !== storedDifficulty) {
        logger.debug('Update stored difficulty value');
        await setValue('difficulty', difficulty);
      }

      return difficulty;
    }

    logger.warn('Find #level_readout element, but no difficulty matched');
  }

  if (storedDifficulty) return storedDifficulty;

  logger.warn('No stored difficulty found');
  return null;
}

export const getDifficulty = callbackify(getDifficultyAsync);
