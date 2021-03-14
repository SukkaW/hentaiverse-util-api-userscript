/* eslint-disable no-console */
const nameStyle = 'background: #000; color: #fff';
const infoStyle = 'background: #257942; color: #fff';
const warnStyle = 'background: #947600; color: #fff';
const errorStyle = 'background: #cc0f35; color: #fff';
const msgStyle = 'background: transparent; color: #000';

export const logger = {
  info(...msg: string[]): void {
    console.log(`%c HVULAPI %c INFO %c`, nameStyle, infoStyle, msgStyle, msg);
  },
  warn(...msg: string[]): void {
    console.log(`%c HVULAPI %c WARN %c`, nameStyle, warnStyle, msgStyle, msg);
  },
  error(...msg: string[]): void {
    console.error(`%c HVULAPI %c ERROR %c`, nameStyle, errorStyle, msgStyle, msg);
  }
};
