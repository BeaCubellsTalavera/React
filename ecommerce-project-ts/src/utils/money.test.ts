import { it, expect, describe } from 'vitest';
import { formatMoney } from './money';

describe('formatMoney', () => {
    it('formats 1999 cents as $19.99', () => {
        const result = formatMoney(1999);
        expect(result).toBe('$19.99');
    });

    it('displays 2 decimals', () => {
        expect(formatMoney(1090)).toBe('$10.90');
        expect(formatMoney(100)).toBe('$1.00');
        expect(formatMoney(0)).toBe('$0.00');
    });

    it('works with negative numbers', () => {
        expect(formatMoney(-999)).toBe('-$9.99');
        expect(formatMoney(-100)).toBe('-$1.00');
    });
});