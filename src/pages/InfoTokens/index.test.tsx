import { useDisableNFTRoutes } from 'hooks/useDisableNFTRoutes'
import { mocked } from 'test-utils/mocked'
import { render } from 'test-utils/render'

import InfoTokens from '.'

jest.mock('hooks/useDisableNFTRoutes')

describe('disable nft on landing page', () => {
  it('renders nft information and card', () => {
    mocked(useDisableNFTRoutes).mockReturnValue(false)
    const { container } = render(<InfoTokens />)
    expect(container).toMatchSnapshot()
    expect(container).toHaveTextContent('Top tokens on Ring Exchange')
    expect(container).toHaveTextContent('List your tokens on DEX')
    expect(container).toHaveTextContent('Traded by millions of users.')
    expect(container).toHaveTextContent(
      'Ring Exchange enables single side liquidity provision on Decentralized Exchange.'
    )
    expect(container).toHaveTextContent(
      'Allowing Web3.0 users trade your tokens freely and openly without creating account.'
    )
    expect(container).toHaveTextContent('I want to list a token on Ring Exchange')
  })

  it('does not render nft information and card', () => {
    mocked(useDisableNFTRoutes).mockReturnValue(true)
    const { container } = render(<InfoTokens />)
    expect(container).toMatchSnapshot()
    expect(container).not.toHaveTextContent('NFTs')
    expect(container).not.toHaveTextContent('NFT')
    expect(container).not.toHaveTextContent('Trade NFTs')
    expect(container).not.toHaveTextContent('Explore NFTs')
    expect(container).not.toHaveTextContent(
      'Buy and sell NFTs across marketplaces to find more listings at better prices.'
    )
  })
})
