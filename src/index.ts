import type { DependencyList } from "react";
import { useEffect } from "react";

/**
 * Utility type to omit the first parameter of a function.
 */
type OmitFirstParam<T extends (...args: any[]) => any> = T extends (
  arg1: any,
  ...rest: infer R
) => infer Ret
  ? (...args: R) => Ret
  : never;

const DOCUMENT = typeof window !== "undefined";

/**
 * Creates a custom event with an associated React hook for listening.
 *
 * @param {string} eventName - The name of the custom event.
 * @returns - A hook function for listening to the event, with an additional `dispatch` method to emit the event.
 */
export function createCustomEvent<Payload>(eventName: string) {
  /**
   * Dispatches the custom event with the specified payload.
   *
   * @param {Payload} payload - The data to include in the event's `detail` property.
   * @param {EventInit} [eventInitDict] - Additional options for the event.
   */
  function dispatch(payload: Payload, eventInitDict?: EventInit) {
    document.dispatchEvent(
      new CustomEvent<Payload>(eventName, {
        ...eventInitDict,
        detail: payload,
      }),
    );
  }

  const hook = useCustomEventListener.bind(null, eventName);

  // @ts-expect-error ...
  hook.dispatch = dispatch;
  // @ts-expect-error ...
  hook.eventName = eventName;

  return hook as OmitFirstParam<typeof useCustomEventListener<Payload>> & {
    dispatch: typeof dispatch;
    eventName: typeof eventName;
  };
}

/**
 * React hook for listening to a custom DOM event.
 *
 * @param {string} eventName - The name of the custom event to listen for.
 * @param {(payload: Payload, event: CustomEvent<Payload>) => void} onListen - Callback executed when the event is triggered.
 * @param {Object} [options] - Optional configurations for the listener.
 * @param {boolean} [options.listen] - Whether the listener should be active.
 * @param {() => void} [options.onStartListening] - Callback when the listener starts.
 * @param {() => void} [options.onStopListening] - Callback when the listener stops.
 * @param {DependencyList} [deps] - Dependency array for re-subscribing to the event.
 */
export function useCustomEventListener<Payload>(
  eventName: string,
  onListen: (payload: Payload, event: CustomEvent<Payload>) => void,
  options?: {
    listen?: boolean;
    onStartListening?: () => void;
    onStopListening?: () => void;
  },
  deps?: DependencyList,
) {
  const { listen, onStartListening, onStopListening } = options ?? {};

  /**
   * Builds the dependency list for the `useEffect` hook.
   */
  function getDepList() {
    const depList: unknown[] = [];

    if (deps !== undefined) {
      depList.push(...deps);

      if (listen !== undefined) {
        depList.push(listen);
      }
    }

    if (depList.length === 0) {
      return;
    }

    return depList;
  }

  /**
   * Internal event handler that wraps the provided callback.
   */
  function handleCallback(event: Event) {
    const customEvent = event as CustomEvent<Payload>;

    onListen(customEvent.detail, customEvent);
  }

  useEffect(() => {
    if (listen !== undefined && !listen) {
      return;
    }

    onStartListening?.();
    document.addEventListener(eventName, handleCallback);

    return () => {
      onStopListening?.();
      document.removeEventListener(eventName, handleCallback);
    };
  }, getDepList());
}
