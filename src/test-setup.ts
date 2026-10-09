// Shared Vitest setup for the Angular unit-test builder. jsdom (used as the test DOM
// environment) does not implement `ResizeObserver`, but <runway-grid> (the custom element
// wrapped by RunwayWrapperComponent) relies on it to track content size changes as soon as
// it's connected to the DOM. Without this stub, any test that mounts <runway-grid> throws
// `ReferenceError: ResizeObserver is not defined`.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe(): void {
    }

    unobserve(): void {
    }

    disconnect(): void {
    }
  }

  (globalThis as any).ResizeObserver = ResizeObserverStub;
}
