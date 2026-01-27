import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounceCallback } from './useDebounceCallback';

describe('useDebounceCallback', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('debounces the callback function', () => {
        const callback = vi.fn();
        const delay = 500;

        const { result } = renderHook(() => useDebounceCallback(callback, delay));
        // renderHook allows you to render a hook within a test React component without having to
        // create that component yourself.

        // Call the debounced function multiple times
        act(() => {
            result.current.debounced('arg1');
            result.current.debounced('arg2');
            result.current.debounced('arg3');
        });

        // Callback should not have been called yet
        expect(callback).not.toHaveBeenCalled();

        // Fast-forward time by 499ms
        act(() => {
            vi.advanceTimersByTime(499);
        });

        // Still should not have been called
        expect(callback).not.toHaveBeenCalled();

        // Fast-forward by 1 more ms (total 500ms)
        act(() => {
            vi.advanceTimersByTime(1);
        });

        // Now it should have been called once with the last arguments
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('arg3');
    });

    it('cancels the timeout when called multiple times', () => {
        const callback = vi.fn();
        const delay = 500;

        const { result } = renderHook(() => useDebounceCallback(callback, delay));

        // Call debounced function
        act(() => {
            result.current.debounced('first');
        });

        // Advance time by 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Call again (should cancel the previous timeout)
        act(() => {
            result.current.debounced('second');
        });

        // Advance time by 300ms more (total 600ms from first call, 300ms from second)
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Should not have been called yet (second call needs 500ms total)
        expect(callback).not.toHaveBeenCalled();

        // Advance by 200ms more (total 500ms from second call)
        act(() => {
            vi.advanceTimersByTime(200);
        });

        // Now should be called with the second argument
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('second');
    });

    it('can be cancelled manually', () => {
        const callback = vi.fn();
        const delay = 500;

        const { result } = renderHook(() => useDebounceCallback(callback, delay));

        // Call debounced function
        act(() => {
            result.current.debounced('test');
        });

        // Advance time by 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Cancel manually
        act(() => {
            result.current.cancel();
        });

        // Advance time past the original delay
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Should never have been called
        expect(callback).not.toHaveBeenCalled();
    });

    it('handles multiple arguments correctly', () => {
        const callback = vi.fn();
        const delay = 100;

        const { result } = renderHook(() => useDebounceCallback(callback, delay));

        act(() => {
            result.current.debounced('arg1', 'arg2', { key: 'value' }, 123);
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(callback).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' }, 123);
    });

    it('updates when callback or delay changes', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        let delay = 500;

        const { result, rerender } = renderHook(
            ({ cb, d }) => useDebounceCallback(cb, d),
            { initialProps: { cb: callback1, d: delay } }
        );

        // Call with first callback
        act(() => {
            result.current.debounced('test1');
        });

        // Change callback before timeout
        rerender({ cb: callback2, d: delay });

        // Make another call with the new callback
        act(() => {
            result.current.debounced('test2');
        });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(callback1).not.toHaveBeenCalled(); // First call was cancelled by the second call
        expect(callback2).toHaveBeenCalledWith('test2');
    });

    it('works with different delay values', () => {
        const callback = vi.fn();

        const { result, rerender } = renderHook(
            ({ delay }) => useDebounceCallback(callback, delay),
            { initialProps: { delay: 100 } }
        );

        // Test with 100ms delay
        act(() => {
            result.current.debounced('fast');
        });

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(callback).toHaveBeenCalledWith('fast');

        // Clear the mock
        callback.mockClear();

        // Change delay to 1000ms
        rerender({ delay: 1000 });

        act(() => {
            result.current.debounced('slow');
        });

        // Should not be called after 100ms
        act(() => {
            vi.advanceTimersByTime(100);
        });
        expect(callback).not.toHaveBeenCalled();

        // Should be called after 1000ms total
        act(() => {
            vi.advanceTimersByTime(900);
        });
        expect(callback).toHaveBeenCalledWith('slow');
    });

    it('cancel function is stable across renders', () => {
        const callback = vi.fn();

        const { result, rerender } = renderHook(() => useDebounceCallback(callback, 500));

        const firstCancel = result.current.cancel;

        rerender();

        const secondCancel = result.current.cancel;

        // Cancel function should be the same reference
        expect(firstCancel).toBe(secondCancel);
    });

    it('clears timeout reference when cancel is called', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebounceCallback(callback, 500));

        // Start a debounced call
        act(() => {
            result.current.debounced('test');
        });

        // Cancel it
        act(() => {
            result.current.cancel();
        });

        // Start another debounced call immediately
        act(() => {
            result.current.debounced('test2');
        });

        // Advance time
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Should only be called once with the second argument
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('test2');
    });
});