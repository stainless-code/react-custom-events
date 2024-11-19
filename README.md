# Custom Event Hook Library

This library provides utilities to simplify working with custom DOM events in React, allowing you to dispatch and listen for events in a declarative and type-safe manner.

---

## Features

- **Type-safe custom event handling**: Define the payload type for your custom events.
- **Declarative React hooks**: Easily manage event listeners with React’s lifecycle.
- **Optional hooks customization**: Specify when to start/stop listening and include dependencies for event handling.

---

## Installation

Install the library via npm or yarn:

```bash
# npm
npm i @stainless-code/react-custom-events

# yarn
yarn add @stainless-code/react-custom-events

# pnpm
pnpm add @stainless-code/react-custom-events

# bun
bun add @stainless-code/react-custom-events
```

---

## API

### `createCustomEvent<Payload>(eventName: string)`

Creates a custom event hook and dispatcher for a given event name.

#### Parameters:

- `eventName`: The name of the custom event to create.

#### Returns:

A React hook with the following properties:

- **Hook function**: A hook to listen for the custom event.
- **dispatch(payload, eventInitDict?)**: Dispatches the custom event with the given payload.

---

### Hook: `useCustomEventListener<Payload>`

This hook listens for custom events and triggers a callback when the event occurs.

#### Parameters:

1. `eventName`: The name of the event to listen for.
2. `onListen(payload, event)`: Callback invoked with the event payload and the `CustomEvent` object.
3. `options?`: (Optional) Object containing:
   - `listen`: A boolean to toggle event listening.
   - `onStartListening`: A callback triggered when the hook starts listening.
   - `onStopListening`: A callback triggered when the hook stops listening.
4. `deps?`: (Optional) Dependency list to control re-subscription.

---

## Example Usage

### Creating a Custom Event

```typescript
import { createCustomEvent } from "@stainless-code/react-custom-events";

// Define a custom event hook with a typed payload
const useMyEvent = createCustomEvent<{ age: number }>("myCustomEvent");

// Dispatch the event
useMyEvent.dispatch({ age: 28 });
```

### Listening for Custom Events

```typescript
// Listen for the event
useMyEvent((payload) => {
  console.log(`Received age: ${payload.age}`);
});

// Advanced usage with options
useMyEvent(
  (payload) => console.log(`Received age: ${payload.age}`),
  {
    listen: true, // Start listening immediately
    onStartListening: () => console.log("Started listening"),
    onStopListening: () => console.log("Stopped listening"),
  },
  [
    /* dependencies */
  ],
);
```

---

## How It Works

1. **`createCustomEvent`**:

   - Creates a custom event dispatcher and corresponding hook for easy integration.
   - The `dispatch` method triggers a DOM `CustomEvent` with the provided payload.

2. **`useCustomEventListener`**:
   - Handles the lifecycle of adding and removing event listeners in a React-friendly manner.
   - Automatically cleans up listeners when the component unmounts or dependencies change.

---

## Type Safety

Leverage TypeScript to enforce strict type checking for your event payloads, ensuring reliability and reducing runtime errors.

---

## Example in Context

```typescript
const useUserLoginEvent = createCustomEvent<{ userId: string }>("userLogin");

// Dispatch the event
useUserLoginEvent.dispatch({ userId: "abc123" });

// Listen for the event
useUserLoginEvent((payload) =>
  console.log(`User logged in: ${payload.userId}`),
);
```

---

## Contributing

Feel free to submit issues or PRs to improve the library!

---

## License

[MIT](./LICENSE)
