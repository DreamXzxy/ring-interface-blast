import { Chain } from 'graphql/data/__generated__/types-and-hooks'
import { renderHook } from 'test-utils/render'

import { useTokensSparkLine } from './useTokenPrices'

describe('useTokensSparkLine', () => {
  it('returns the right initial value based on breakpoints', () => {
    const { result } = renderHook(() => useTokensSparkLine(Chain.Ethereum))
    expect(result).toMatchSnapshot()
  })
})
