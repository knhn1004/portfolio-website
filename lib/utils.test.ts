import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
	it('merges basic classes', () => {
		expect(cn('a', 'b')).toBe('a b');
	});

	it('resolves conflicting tailwind classes using tailwind-merge', () => {
		expect(cn('px-2', 'px-4')).toBe('px-4');
	});

	it('drops falsy values', () => {
		expect(cn('a', false, null, undefined, 'b')).toBe('a b');
	});

	it('handles conditional objects via clsx', () => {
		expect(cn('a', { b: true, c: false })).toBe('a b');
	});
});
