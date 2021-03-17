/* eslint-disable @typescript-eslint/no-explicit-any */
let DEBUG = true;

/* eslint-disable no-console */
const nameStyle = 'background: #000; color: #fff';
const debugStyle = 'background: #7a7a7a; color: #fff';
const infoStyle = 'background: #257942; color: #fff';
const warnStyle = 'background: #947600; color: #fff';
const errorStyle = 'background: #cc0f35; color: #fff';
const msgStyle = 'background: transparent; color: #000';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class logger {
  static debug(...msg: any[]): void {
    if (DEBUG) {
      console.log('%c HVULAPI %c DEBUG %c', nameStyle, debugStyle, msgStyle, ...msg);
    }
  }

  static info(...msg: any[]): void {
    console.log('%c HVULAPI %c INFO %c', nameStyle, infoStyle, msgStyle, ...msg);
  }

  static warn(...msg: any[]): void {
    console.log('%c HVULAPI %c WARN %c', nameStyle, warnStyle, msgStyle, ...msg);
  }

  static error(...msg: any[]): void {
    console.error('%c HVULAPI %c ERROR %c', nameStyle, errorStyle, msgStyle, ...msg);
  }
}

/**
 * Enable verbose log output in console.
 */
export function enableVerboseMode(): void {
  DEBUG = true;
}
/**
 * Disable verbose log output in console.
 */
export function disableVerboseMode(): void {
  DEBUG = false;
}
