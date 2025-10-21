import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  const addError = useCallback((message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    const error: ErrorState = {
      message,
      type,
      timestamp: Date.now()
    };
    setErrors(prev => [...prev, error]);

    // Auto-remove after 5 seconds for warnings and info
    if (type !== 'error') {
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e.timestamp !== error.timestamp));
      }, 5000);
    }
  }, []);

  const removeError = useCallback((timestamp: number) => {
    setErrors(prev => prev.filter(e => e.timestamp !== timestamp));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors: errors.length > 0
  };
};