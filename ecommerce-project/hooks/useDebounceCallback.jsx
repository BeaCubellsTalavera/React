import { useRef, useCallback } from 'react';

export function useDebounceCallback(callback, delay) {
    const timeoutRef = useRef(null);

    const debounced = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            console.log('Debounced callback executed');
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