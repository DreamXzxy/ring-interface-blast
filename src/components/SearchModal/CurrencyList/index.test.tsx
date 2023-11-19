import { screen } from '@testing-library/react'
import { Currency, CurrencyAmount as mockCurrencyAmount, Token as mockToken } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { DAI, USDC_MAINNET, WBTC } from 'constants/tokens'
import * as mockJSBI from 'jsbi'
import { mocked } from 'test-utils/mocked'
import { render } from 'test-utils/render'

import CurrencyList from '.'

const noOp = function () {
  // do nothing
}

const daiCurrencyAmount = (currency: Currency) => {
  return daiMockCurrencyAmt[(currency as mockToken)?.address]
}

const daiMockCurrencyAmt = {
  [DAI.address]: mockCurrencyAmount.fromRawAmount(DAI, mockJSBI.default.BigInt(2)),
}

const mockCurrencyAmt = {
  [DAI.address]: mockCurrencyAmount.fromRawAmount(DAI, mockJSBI.default.BigInt(100)),
  [USDC_MAINNET.address]: mockCurrencyAmount.fromRawAmount(USDC_MAINNET, mockJSBI.default.BigInt(10)),
  [WBTC.address]: mockCurrencyAmount.fromRawAmount(WBTC, mockJSBI.default.BigInt(1)),
}

jest.mock(
  'components/Logo/CurrencyLogo',
  () =>
    ({ currency }: { currency: Currency }) =>
      `CurrencyLogo currency=${currency.symbol}`
)

jest.mock('../../../state/connection/hooks', () => {
  return {
    useCurrencyBalance: (currency: Currency) => {
      return mockCurrencyAmt[(currency as mockToken)?.address]
    },
  }
})

it('renders loading rows when isLoading is true', () => {
  const component = render(
    <CurrencyList
      height={10}
      currencies={[]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={true}
      searchQuery=""
      isAddressSearch=""
      balances={{}}
    />
  )
  expect(component.findByTestId('loading-rows')).toBeTruthy()
  expect(screen.queryByText('Wrapped BTC')).not.toBeInTheDocument()
  expect(screen.queryByText('DAI')).not.toBeInTheDocument()
  expect(screen.queryByText('USDC')).not.toBeInTheDocument()
})

it('renders currency rows correctly when currencies list is non-empty', () => {
  render(
    <CurrencyList
      height={10}
      currencies={[DAI, USDC_MAINNET, WBTC]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={false}
      searchQuery=""
      isAddressSearch=""
      balances={{}}
    />
  )
  expect(screen.getByText('Wrapped BTC')).toBeInTheDocument()
  expect(screen.getByText('DAI')).toBeInTheDocument()
  expect(screen.getByText('USDC')).toBeInTheDocument()
})

it('renders currency rows correctly with balances', () => {
  mocked(useWeb3React).mockReturnValue({
    account: '0x52270d8234b864dcAC9947f510CE9275A8a116Db',
    isActive: true,
  } as ReturnType<typeof useWeb3React>)
  render(
    <CurrencyList
      height={10}
      currencies={[DAI, USDC_MAINNET, WBTC]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={false}
      searchQuery=""
      isAddressSearch=""
      showCurrencyAmount
      balances={{
        [DAI.address.toLowerCase()]: daiCurrencyAmount(DAI),
        [USDC_MAINNET.address.toLowerCase()]: daiCurrencyAmount(DAI),
        [WBTC.address.toLowerCase()]: daiCurrencyAmount(DAI),
      }}
    />
  )
  expect(screen.getByText('DAI')).toBeInTheDocument()
  expect(screen.getByText('Wrapped BTC')).toBeInTheDocument()
  expect(screen.getByText('USDC')).toBeInTheDocument()
})

// Test: Behavior when no currency is selected
it('renders correctly when no currency is selected', () => {
  render(
    <CurrencyList
      height={10}
      currencies={[DAI, USDC_MAINNET, WBTC]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={false}
      searchQuery=""
      isAddressSearch=""
      balances={{}}
    />
  )
  expect(screen.queryByText('DAI')).toBeInTheDocument()
  expect(screen.queryByText('Wrapped BTC')).toBeInTheDocument()
  expect(screen.queryByText('USDC')).toBeInTheDocument()
  expect(screen.queryByTestId('selected-currency')).not.toBeInTheDocument()
})

// Test: Behavior for user added tokens
it('renders user added token correctly', () => {
  render(
    <CurrencyList
      height={10}
      currencies={[DAI]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={false}
      searchQuery=""
      isAddressSearch=""
      balances={{}}
    />
  )
  expect(screen.getByText('DAI')).toBeInTheDocument()
})

it('renders loading rows when isLoading is false', () => {
  const { asFragment } = render(
    <CurrencyList
      height={10}
      currencies={[]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={false}
      searchQuery=""
      isAddressSearch=""
      balances={{}}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})

it('renders currency rows correctly when currencies list is empty', () => {
  const { asFragment } = render(
    <CurrencyList
      height={10}
      currencies={[DAI, USDC_MAINNET, WBTC]}
      otherListTokens={[]}
      selectedCurrency={null}
      onCurrencySelect={noOp}
      isLoading={false}
      searchQuery=""
      isAddressSearch=""
      balances={{}}
    />
  )
  expect(asFragment()).toMatchSnapshot()
})
