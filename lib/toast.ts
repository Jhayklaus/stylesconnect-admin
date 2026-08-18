// Tiny pub/sub so any code (hooks, the axios layer, components) can raise a
// toast without threading React context around. The <Toaster /> in the root
// layout is the single subscriber that renders them.

export type ToastKind = "success" | "error";

export interface ToastData {
  id: number;
  kind: ToastKind;
  message: string;
}

type ToastListener = (toast: ToastData) => void;

const listeners = new Set<ToastListener>();
let nextId = 1;

export function subscribeToToasts(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(kind: ToastKind, message: string) {
  const trimmed = message?.trim();
  if (!trimmed) return;
  const data: ToastData = { id: nextId++, kind, message: trimmed };
  listeners.forEach((listener) => listener(data));
}

export const toast = {
  success: (message: string) => emit("success", message),
  error: (message: string) => emit("error", message),
};
