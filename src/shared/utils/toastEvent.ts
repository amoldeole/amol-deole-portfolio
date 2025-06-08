type ToastPayload = {
  _id?: string;
  type?: 'notification' | 'success' | 'warning' | 'error' | 'info';
  message: string;
};

type ToastListener = (payload: Required<ToastPayload>) => void;

let listener: ToastListener | null = null;

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8);
}

export function subscribeToast(fn: ToastListener) {
  listener = fn;
}

export function unsubscribeToast() {
  listener = null;
}

export function showToast(payload: ToastPayload) {
  const _id = payload._id || generateId();
  const type = payload.type ?? 'info';
  if (listener) listener({ ...payload, _id, type });
}