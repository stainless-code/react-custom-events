import { renderHook } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCustomEvent, useCustomEventListener } from "./index";

describe("createCustomEvent", () => {
  afterEach(() => {
    // Clean up all event listeners after each test
    vi.restoreAllMocks();
  });

  it("should create a custom event and allow dispatching it", () => {
    const onCustomEvent = vi.fn();
    const useCustomEvent = createCustomEvent<string>("testEvent");

    // Listen for the event
    renderHook(() =>
      useCustomEvent((payload) => {
        onCustomEvent(payload);
      }),
    );

    // Dispatch the event
    act(() => {
      useCustomEvent.dispatch("hello world");
    });

    expect(onCustomEvent).toHaveBeenCalledWith("hello world");
  });

  it("should expose the event name", () => {
    const useCustomEvent = createCustomEvent<string>("myEvent");
    expect(useCustomEvent.eventName).toBe("myEvent");
  });
});

describe("useCustomEventListener", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call the listener when the event is triggered", () => {
    const onListen = vi.fn();
    const eventName = "testEvent";

    // Render the hook
    renderHook(() =>
      useCustomEventListener(eventName, (payload) => {
        onListen(payload);
      }),
    );

    // Dispatch the event
    act(() => {
      const event = new CustomEvent(eventName, { detail: "test payload" });
      document.dispatchEvent(event);
    });

    expect(onListen).toHaveBeenCalledWith("test payload");
  });

  it("should respect the listen option", () => {
    const onListen = vi.fn();
    const eventName = "testEvent";

    // Render the hook with `listen: false`
    renderHook(() =>
      useCustomEventListener(
        eventName,
        (payload) => {
          onListen(payload);
        },
        { listen: false },
      ),
    );

    // Dispatch the event
    act(() => {
      const event = new CustomEvent(eventName, { detail: "test payload" });
      document.dispatchEvent(event);
    });

    expect(onListen).not.toHaveBeenCalled();
  });

  it("should call onStartListening and onStopListening callbacks", () => {
    const onStartListening = vi.fn();
    const onStopListening = vi.fn();
    const eventName = "testEvent";

    // Render the hook
    const { unmount } = renderHook(() =>
      useCustomEventListener(eventName, () => {}, {
        onStartListening,
        onStopListening,
      }),
    );

    // Verify that onStartListening was called
    expect(onStartListening).toHaveBeenCalled();

    // Unmount the hook and verify that onStopListening was called
    unmount();
    expect(onStopListening).toHaveBeenCalled();
  });

  it("should react to dependency changes", () => {
    const onListen = vi.fn();
    const eventName = "testEvent";

    // Track the listen state
    let listen = true;
    const { rerender } = renderHook(
      ({ listenState }) =>
        useCustomEventListener(
          eventName,
          (payload) => {
            onListen(payload);
          },
          { listen: listenState },
        ),
      { initialProps: { listenState: listen } },
    );

    // Dispatch the event
    act(() => {
      const event = new CustomEvent(eventName, { detail: "test payload" });
      document.dispatchEvent(event);
    });

    expect(onListen).toHaveBeenCalled();

    // Update the listen state and rerender
    listen = false;
    rerender({ listenState: listen });

    // Dispatch the event again
    act(() => {
      const event = new CustomEvent(eventName, { detail: "test payload" });
      document.dispatchEvent(event);
    });

    expect(onListen).toHaveBeenCalledTimes(1); // No additional calls
  });
});
