import { version } from './';

interface unsafeWindow extends Window {
  version: string
}

declare var unsafeWindow: unsafeWindow;

unsafeWindow.version = version;
