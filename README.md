# @stainless-code/react-custom-events

This library provides utilities to simplify working with custom DOM events in React, allowing you to dispatch and listen for events in a declarative and type-safe manner.

## Features

- Typesafe
- Reusable
- Simple API
- Centralised event dispatcher and listener

## Installation

### npm

```bash
npm install @stainless-code/react-custom-events
```

### yarn

```bash
yarn add @stainless-code/react-custom-events
```

### pnpm

```bash
pnpm add @stainless-code/react-custom-events
```

### bun

```bash
bun add @stainless-code/react-custom-events
```

## Usage

### 1. Basic

```tsx
import { createCustomEvent } from "@stainless-code/react-custom-events";

// Create event
const useMyEvent = createCustomEvent<string>("my-event");

function MyComponent() {
  // Listen for the event
  useMyEvent((payload) => console.log("Event received with payload:", payload));

  return (
    // Dispatch event
    <button onClick={() => useMyEvent.dispatch("hello!")}>
      Dispatch event
    </button>
  );
}
```

### 2. With options and dependency list

```tsx
import { createCustomEvent } from "@stainless-code/react-custom-events";
import { useState } from "react";

// Create event
const useMyEvent = createCustomEvent<string>("my-event");

function MyComponent() {
  const [enabled, setEnabled] = useState(true);

  // Listen for the event
  useMyEvent(
    (payload, event) =>
      console.log("Event received with payload:", payload, event),
    {
      listen: enabled, // Control whether the listener is active
      onStartListening: () => console.log("Started listening"),
      onStopListening: () => console.log("Stopped listening"),
    },
    [enabled], // Re-subscribe when `enabled` changes
  );

  return (
    <>
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? "Disable" : "Enable"} event listener
      </button>
      <button onClick={() => useMyEvent.dispatch("hello!")}>
        Dispatch event
      </button>
    </>
  );
}
```

## Typesafety

```tsx
const useMyEvent = createCustomEvent<string>("my-event");

// dispatching
useMyEvent.dispatch("Valid string payload"); // ✅ Correct type
useMyEvent.dispatch(123); // ❌ TypeScript error: Expected 'string', got 'number'

// listening
useMyEvent((payload) => {
  console.log(payload.toUpperCase()); // ✅ Correct method for string
  console.log(payload * 2); // ❌ TypeScript error: 'string' is not a number
});
```

## API

### `createCustomEvent()`

Creates a custom event with a given name and returns a hook for listening to it and a `dispatch` function for triggering the event.

| Parameter   | Type     | Description                   | Default    |
| ----------- | -------- | ----------------------------- | ---------- |
| `eventName` | `string` | The name of the custom event. | (required) |

#### Returns

- `useCustomEventListener` with `eventName` prepopulated along with a `dispatch` method to trigger the event and the `eventName` property.

---

### `useCustomEventListener()`

Custom hook to listen for a custom event and handle the payload.

| Parameter                  | Type                                                      | Description                                              | Default            |
| -------------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------------------ |
| `eventName`                | `string`                                                  | The name of the custom event to listen for.              | (required)         |
| `onListen`                 | `(payload: Payload, event: CustomEvent<Payload>) => void` | Callback to handle the event payload and event object.   | (required)         |
| `options` (optional)       | `Object`                                                  | Additional configuration for the event listener.         | `{ listen: true }` |
| `options.listen`           | `boolean`                                                 | Whether the listener should be active (default: `true`). | `true`             |
| `options.onStartListening` | `() => void`                                              | Callback when the listener starts.                       | `undefined`        |
| `options.onStopListening`  | `() => void`                                              | Callback when the listener stops.                        | `undefined`        |
| `deps` (optional)          | `DependencyList`                                          | Dependency list for re-subscribing to the event.         | `undefined`        |

## Contributing

Feel free to submit issues or pull requests to improve the library. Every bit of help is appreciated. 💖

[Read the contribution guidelines](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
