/** Emits immediately, then at most once per interval, including the final value. */
export function createThrottle<T>(callback: (value: T) => void, interval: number) {
  let lastUpdate = Number.NEGATIVE_INFINITY;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let latest: T;

  function cancel() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }

  function push(value: T, immediate = false) {
    latest = value;
    cancel();
    const remaining = interval - (Date.now() - lastUpdate);
    if (remaining <= 0 || immediate) {
      lastUpdate = Date.now();
      callback(value);
      return;
    }
    timer = setTimeout(() => {
      timer = null;
      lastUpdate = Date.now();
      callback(latest);
    }, remaining);
  }

  return { push, cancel };
}
