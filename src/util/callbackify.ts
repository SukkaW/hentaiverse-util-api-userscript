type SimpleCallback = (onerror: ((args: any) => any) | null, onload: ((args: any) => any) | null) => void;

export function callbackify(fn: () => Promise<any>): (cb: SimpleCallback) => void {
  return (cb: SimpleCallback) => {
    fn().then(fullfilled => {
      setTimeout(cb, 0, null, fullfilled);
    }, rejected => {
      setTimeout(cb, 0, rejected);
    });
  }
}
