import { useRef, useCallback } from 'react';

export function useDebounceCallback<T extends unknown[]>(
    callback: (...args: T) => void, 
    delay: number
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debounced = useCallback((...args: T) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return { debounced, cancel };
}