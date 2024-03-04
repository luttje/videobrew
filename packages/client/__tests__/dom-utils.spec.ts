import { modifyTransform } from '../src/dom-utils';
import { it, expect, describe, vi } from 'vitest';

describe('modifyTransform', () => {
  it('should add a new transform', () => {
    expect(modifyTransform('', 'rotate', 90)).toBe('rotate(90)');
  });

  it('should replace an existing transform', () => {
    expect(modifyTransform('rotate(90)', 'rotate', 180)).toBe('rotate(180)');
  });

  it('should preserve existing transforms', () => {
    expect(modifyTransform('scale(2)', 'rotate', 90)).toBe('scale(2) rotate(90)');
  });
});