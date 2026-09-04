import { useState } from 'react';

export function useConfirmDelete({ onConfirm }) {
  const [target, setTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function open(item) {
    setTarget(item);
  }

  function close() {
    if (!isSubmitting) setTarget(null);
  }

  async function confirm() {
    if (!target) return;
    setIsSubmitting(true);
    try {
      await onConfirm(target);
      setTarget(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    target,
    isOpen: Boolean(target),
    isSubmitting,
    open,
    close,
    confirm,
  };
}
