import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce({ value: 'initial', delay: 500 }));
        
        expect(result.current).toBe('initial');
    });

    it('debounces value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        expect(result.current).toBe('initial');

        // Change the value
        rerender({ value: 'updated', delay: 500 });

        // Should still be the initial value
        expect(result.current).toBe('initial');

        // Fast-forward time by 499ms
        act(() => {
            vi.advanceTimersByTime(499);
        });

        // Should still be the initial value
        expect(result.current).toBe('initial');

        // Fast-forward by 1 more ms (total 500ms)
        act(() => {
            vi.advanceTimersByTime(1);
        });

        // Now should be updated
        expect(result.current).toBe('updated');
    });

    it('cancels previous timeout when value changes quickly', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'first', delay: 500 } }
        );

        expect(result.current).toBe('first');

        // First change
        rerender({ value: 'second', delay: 500 });
        
        // Advance time by 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });
        
        // Should still be first
        expect(result.current).toBe('first');

        // Second change (should cancel the first timeout)
        rerender({ value: 'third', delay: 500 });

        // Advance time by 300ms more (total 600ms from first change, 300ms from second)
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Should still be first (second change needs full 500ms)
        expect(result.current).toBe('first');

        // Advance by 200ms more (total 500ms from second change)
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // Should be the latest value (third)
        expect(result.current).toBe('third');
    });

    it('works with different delay values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'initial', delay: 100 } }
        );

        // Change value with 100ms delay
        rerender({ value: 'fast', delay: 100 });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(result.current).toBe('fast');

        // Change delay and value
        rerender({ value: 'slow', delay: 1000 });

        // Should not update after 100ms
        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current).toBe('fast');

        // Should update after 1000ms total
        act(() => {
            vi.advanceTimersByTime(900);
        });
        expect(result.current).toBe('slow');
    });

    it('handles zero delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'initial', delay: 0 } }
        );

        expect(result.current).toBe('initial');

        rerender({ value: 'immediate', delay: 0 });

        // With 0 delay, should update immediately on next tick
        act(() => {
            vi.advanceTimersByTime(0);
        });

        expect(result.current).toBe('immediate');
    });

    it('works with different value types', () => {
        // Test with numbers
        const { result: numberResult, rerender: numberRerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 1, delay: 500 } }
        );

        expect(numberResult.current).toBe(1);

        numberRerender({ value: 42, delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(numberResult.current).toBe(42);

        // Test with objects
        const initialObj = { name: 'John', age: 30 };
        const updatedObj = { name: 'Jane', age: 25 };

        const { result: objResult, rerender: objRerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: initialObj, delay: 500 } }
        );

        expect(objResult.current).toBe(initialObj);

        objRerender({ value: updatedObj, delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(objResult.current).toBe(updatedObj);

        // Test with arrays
        const { result: arrayResult, rerender: arrayRerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: [1, 2, 3], delay: 500 } }
        );

        expect(arrayResult.current).toEqual([1, 2, 3]);

        arrayRerender({ value: [4, 5, 6], delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(arrayResult.current).toEqual([4, 5, 6]);
    });

    it('updates when delay changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        // Change value
        rerender({ value: 'updated', delay: 500 });

        // Change delay before timeout
        rerender({ value: 'updated', delay: 100 });

        // Should update after the new delay (100ms)
        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(result.current).toBe('updated');
    });

    it('handles rapid value changes correctly', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'v1', delay: 500 } }
        );

        expect(result.current).toBe('v1');

        // Rapid changes
        rerender({ value: 'v2', delay: 500 });
        rerender({ value: 'v3', delay: 500 });
        rerender({ value: 'v4', delay: 500 });
        rerender({ value: 'v5', delay: 500 });

        // Should still be the initial value
        expect(result.current).toBe('v1');

        // After delay, should be the last value
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe('v5');
    });

    it('cleans up timeout on unmount', () => {
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

        const { result, rerender, unmount } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        // Change value to start a timeout
        rerender({ value: 'updated', delay: 500 });

        // Unmount before timeout executes
        unmount();

        // clearTimeout should have been called
        expect(clearTimeoutSpy).toHaveBeenCalled();

        clearTimeoutSpy.mockRestore();
    });

    it('handles empty string and falsy values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce({ value, delay }),
            { initialProps: { value: 'initial', delay: 500 } }
        );

        // Test empty string
        rerender({ value: '', delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe('');

        // Test null
        rerender({ value: null, delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe(null);

        // Test undefined
        rerender({ value: undefined, delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe(undefined);

        // Test false
        rerender({ value: false, delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe(false);

        // Test 0
        rerender({ value: 0, delay: 500 });
        
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe(0);
    });
});