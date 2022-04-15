import { logger } from './logger';

// https://github.com/axios/axios/blob/master/lib/helpers/parseHeaders.js
// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateHeaders = new Set([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);
function parseResponseHeaders(headerStr: string | null) {
  const parsed: Record<string, string> = {};
  if (!headerStr) return parsed;

  let key: string;
  let val: string;
  let i: number;

  const headerLines = headerStr.split('\n');

  for (const line of headerLines) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (key) {
      if (parsed[key] && ignoreDuplicateHeaders.has(key)) continue;
      parsed[key] = parsed[key] ? `${parsed[key]}, ${val}` : val;
    }
  }

  return parsed;
}

interface FetchQueueOption {
  maxConnections?: number;
  interval?: number;
}

interface FetchQueueItem {
  readonly url: string;
  readonly init?: RequestInit;
  readonly resolve: (value: Response) => void;
  readonly reject: (reason?: any) => void;
  readonly useGM: boolean;
  state: ItemState;
}

const enum ItemState {
  Pending,
  Active,
  Succeeded,
  Failed,
  Canceled
}

/** Promise that can cancel the request. */
interface FetchQueuePromise<T = any> extends Promise<T> {
  /** Cancel the request and remove it from the queue. */
  cancel(): void;
}

export class FetchQueue {
  private readonly options: FetchQueueOption;
  private pendingItems: FetchQueueItem[] = [];
  private activeItems: FetchQueueItem[] = [];
  private isPaused = false;
  private timer: ReturnType<typeof setTimeout> | null;
  private lastCalled: number;
  private isFirstRequest = true;

  constructor(options: FetchQueueOption = { maxConnections: 4, interval: 300 }) {
    this.options = {
      maxConnections: 4,
      interval: 300,
      ...options
    };

    this.lastCalled = Date.now();
    this.timer = null;
  }

  /** Count of requests pending in the queue. */
  public get pendingCount(): number {
    return this.pendingItems.length;
  }

  /** Count of active request sending out. */
  public get activeCount(): number {
    return this.activeItems.length;
  }

  public setMaxConnections(maxConnections: number): void {
    this.options.maxConnections = maxConnections;
  }

  /**
   * Add a request to the end of the queue.
   */
  public add(url: string, init?: RequestInit, useGM = false): FetchQueuePromise<Response> {
    let item: FetchQueueItem;
    const promise = new Promise((resolve, reject) => {
      item = { url, init, resolve, reject, useGM, state: ItemState.Pending };
      this.pendingItems.push(item);
    }) as FetchQueuePromise;
    promise.cancel = () => this.cancel(item);

    this.checkNext();

    return promise;
  }

  /** Pause the pending list. */
  public pause(): void {
    this.isPaused = true;
  }

  /** Resume the pending list. */
  public resume(): void {
    this.isPaused = false;
    this.checkNext();
  }

  private cancel(item: FetchQueueItem): void {
    switch (item.state) {
      case ItemState.Pending:
        this.pendingItems = this.pendingItems.filter((i) => i !== item);
        break;
      case ItemState.Active:
        // It is sending out. Cannot really cancel the request. Just ignore the response.
        break;
      default:
        // Do noting if it is already finished/canceled
        return;
    }
    item.state = ItemState.Canceled;
    item.reject('Canceled');
  }

  private handleResult(item: FetchQueueItem, state: ItemState.Succeeded, result: Response): void;
  private handleResult(item: FetchQueueItem, state: ItemState.Failed, result: unknown): void;
  private handleResult(item: FetchQueueItem, state: ItemState.Succeeded | ItemState.Failed, result: Response | Error): void {
    this.activeItems = this.activeItems.filter((i) => i !== item);
    item.state = state;

    if (state === ItemState.Succeeded) {
      // Two years have passed, and the sh*t TypeScript still haven't added support for overload narrowing
      // See https://github.com/Microsoft/TypeScript/issues/22609
      if (result instanceof Response) {
        item.resolve(result);
      }
    } else {
      item.reject(result);
    }
  }

  private checkNext() {
    const threshold = this.lastCalled + (this.options?.interval || 300);
    const now = Date.now();

    // Adjust timer if it is called too early
    if (now < threshold && !this.isFirstRequest) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.checkNext();
      }, threshold - now);
      return;
    }

    this.isFirstRequest = false;

    if (this.isPaused) {
      // Paused. Wait until resume. Resume will call checkNext again.
      return;
    }
    if (this.pendingCount > 0 && this.activeCount < (this.options?.maxConnections ?? 4)) {
      const item = this.pendingItems.shift()!;
      this.activeItems.push(item);
      item.state = ItemState.Active;

      this.lastCalled = now;

      logger.debug('[Fetch Queue]', now, item.useGM ? '{GM_XHR}' : '{fetch}', item.init?.method ?? 'GET', item.url);

      if (item.useGM) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        const isBinary = item.init?.body instanceof Blob;
        let headers: Record<string, string>;
        if (item.init?.headers) {
          headers = {};
          if (item.init.headers instanceof Headers) {
            item.init.headers.forEach((value, key) => {
              headers[key] = value;
            });
          } else if (Array.isArray(item.init.headers)) {
            headers = Object.fromEntries(item.init.headers);
          } else {
            headers = item.init.headers;
          }
        } else {
          headers = {};
        }

        GM.xmlHttpRequest({
          url: item.url,
          method: item.init?.method as GM.Request['method'] || 'GET',
          binary: isBinary,
          data: item.init?.body as GM.Request['data'] || undefined,
          headers,
          onerror(e) {
            self.handleResult(item, ItemState.Failed, e);
          },
          onload(r) {
            const resp = new Response(r.responseText, {
              status: r.status,
              statusText: r.statusText,
              headers: parseResponseHeaders(r.responseHeaders)
            });

            self.handleResult(item, ItemState.Succeeded, resp);
          }
        });
      } else {
        const request = new Request(item.url, item.init);

        fetch(request).then(
          (resp) => this.handleResult(item, ItemState.Succeeded, resp),
          (reason) => this.handleResult(item, ItemState.Failed, reason)
        ).then(() => {
          if (this.pendingCount > 0) {
            this.checkNext();
          }
        });
      }
    }
  }
}
