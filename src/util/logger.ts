/* eslint-disable no-console */
const nameStyle = 'background: #000; color: #fff';
const infoStyle = 'background: #257942; color: #fff';
const warnStyle = 'background: #947600; color: #fff';
const errorStyle = 'background: #cc0f35; color: #fff';
const msgStyle = 'background: transparent; color: #000';

export const logger = {
  info(...msg: string[]): void {
    console.log(`%c HVULAPI %c INFO %c ${msg.join(' ')}`, nameStyle, infoStyle, msgStyle);
  },
  warn(...msg: string[]): void {
    console.log(`%c HVULAPI %c WARN %c ${msg.join(' ')}`, nameStyle, warnStyle, msgStyle);
  },
  error(...msg: string[]): void {
    console.error(`%c HVULAPI %c ERROR %c ${msg.join(' ')}`, nameStyle, errorStyle, msgStyle);
  }
};
