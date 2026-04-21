import { useEffect } from 'react';

type TaskToastProps = {
  type: 'loading' | 'success' | 'error';
  message: string;
  onDismiss: () => void;
};

export function TaskToast({ type, message, onDismiss }: TaskToastProps) {
  useEffect(() => {
    if (type === 'loading') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss();
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [type, onDismiss]);

  return (
    <div
      className={`toast toast-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <p>{message}</p>
      {type !== 'loading' ? (
        <button type="button" onClick={onDismiss} aria-label="Fechar notificacao">
          Fechar
        </button>
      ) : null}
    </div>
  );
}
