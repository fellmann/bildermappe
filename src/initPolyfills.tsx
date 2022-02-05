import useViewStore from "./store/useViewStore";

export async function initPolyfills() {
  if (!("ResizeObserver" in window))
    window.ResizeObserver = (await import("@juggle/resize-observer")).ResizeObserver;

  if (!("PointerEvent" in window)) {
    await import("pepjs");
    useViewStore.getState().showAlert("Dieser Browser ist veraltet und wird vermutlich nicht unterstützt!");
  }
}
