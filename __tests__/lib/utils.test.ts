import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should combine classes correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3')
    })

    it('should handle undefined and null values', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
    })

    it('should merge Tailwind classes properly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should handle array of classes', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2')
    })

    it('should handle object with boolean values', () => {
      expect(cn({
        'class1': true,
        'class2': false,
        'class3': true
      })).toBe('class1 class3')
    })
  })
}) 