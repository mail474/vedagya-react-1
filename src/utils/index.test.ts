import { describe, it, expect } from 'vitest'
import { cn, formatDate } from './index'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/2024/)
  })
})
