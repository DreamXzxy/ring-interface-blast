import { renderHook } from 'test-utils/render'

import useTokenTransfers from './useTokenTransfers'

describe('useTokensSparkLine', () => {
  it('returns the right initial value based on breakpoints', () => {
    const { result } = renderHook(() => useTokenTransfers())
    expect(result).toMatchSnapshot()
  })
})
