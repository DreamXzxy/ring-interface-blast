import { renderHook } from 'test-utils/render'

import { useSearchTokens } from './useSearchToken'

describe('useSearchTokens', () => {
  it('returns the right initial value based on breakpoints', () => {
    const { result } = renderHook(() => useSearchTokens())
    expect(result).toMatchSnapshot()
  })
})
