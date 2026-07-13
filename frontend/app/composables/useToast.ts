export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

const toasts = () => useState<Toast[]>('toasts', () => []);

let idCounter = 0;

export const useToast = () => {
  const list = toasts();

  const push = (type: Toast['type'], message: string, duration = 3500) => {
    const id = idCounter++;
    list.value.push({ id, type, message });

    setTimeout(() => {
      remove(id);
    }, duration);
  };

  const remove = (id: number) => {
    list.value = list.value.filter((t) => t.id !== id);
  };

  return {
    toasts: list,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
    remove,
  };
};