/**
 * ```js
 * hv.is.inRiddleMaster();
 * // false
 * ```
 */
export const inRiddleMaster = () => !!document.getElementById('textlog');

/**
 * ```js
 * hv.is.inBattle();
 * // false
 * ```
 */
export const inBattle = () => !!document.getElementById('textlog');
