/* eslint-disable @typescript-eslint/no-explicit-any */
const callbackifyOnRejected = (reason: any, cb: (...args: any[]) => unknown) => {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    reason = new Error(reason);
  }
  return cb(reason);
};

export function callbackify(fn: () => Promise<void>): (callback: (err: Error) => void) => void;
export function callbackify<TResult>(fn: () => Promise<TResult>): (callback: (err: Error, result: TResult) => void) => void;
export function callbackify<T1>(fn: (arg1: T1) => Promise<void>): (arg1: T1, callback: (err: Error) => void) => void;
export function callbackify<T1, TResult>(fn: (arg1: T1) => Promise<TResult>): (arg1: T1, callback: (err: Error, result: TResult) => void) => void;
export function callbackify<T1, T2>(fn: (arg1: T1, arg2: T2) => Promise<void>): (arg1: T1, arg2: T2, callback: (err: Error) => void) => void;
export function callbackify<T1, T2, TResult>(fn: (arg1: T1, arg2: T2) => Promise<TResult>): (arg1: T1, arg2: T2, callback: (err: Error | null, result: TResult) => void) => void;
export function callbackify<T1, T2, T3>(fn: (arg1: T1, arg2: T2, arg3: T3) => Promise<void>): (arg1: T1, arg2: T2, arg3: T3, callback: (err: Error) => void) => void;
export function callbackify<T1, T2, T3, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3) => Promise<TResult>): (arg1: T1, arg2: T2, arg3: T3, callback: (err: Error | null, result: TResult) => void) => void;
export function callbackify<T1, T2, T3, T4>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<void>): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: Error) => void) => void;
export function callbackify<T1, T2, T3, T4, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<TResult>): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: Error | null, result: TResult) => void) => void;
export function callbackify<T1, T2, T3, T4, T5>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<void>): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: Error) => void) => void;
export function callbackify<T1, T2, T3, T4, T5, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult>,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: Error | null, result: TResult) => void) => void;
export function callbackify<T1, T2, T3, T4, T5, T6>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Promise<void>,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, callback: (err: Error) => void) => void;
export function callbackify<T1, T2, T3, T4, T5, T6, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6) => Promise<TResult>
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, callback: (err: Error | null, result: TResult) => void) => void;
export function callbackify(original: any) {
  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified(...args: any[]) {
    const maybeCb = args.pop();

    const cb = (...args: unknown[]) => { maybeCb(args); };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original(args).then(
      (ret: any) => setTimeout(cb, 0, null, ret),
      (rej: any) => setTimeout(callbackifyOnRejected, 0, rej, cb)
    );
  }

  const descriptors = Object.getOwnPropertyDescriptors(original);
  // It is possible to manipulate a functions `length` or `name` property. This
  // guards against the manipulation.
  if (typeof descriptors.length.value === 'number') {
    descriptors.length.value++;
  }
  if (typeof descriptors.name.value === 'string') {
    descriptors.name.value += 'Callbackified';
  }
  Object.defineProperties(callbackified, descriptors);

  return callbackified;
}
