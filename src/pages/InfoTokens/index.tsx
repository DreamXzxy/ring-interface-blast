import { Trans } from '@lingui/macro'
import { InterfacePageName } from '@uniswap/analytics-events'
import { Trace } from 'analytics'
import { useAccountDrawer } from 'components/AccountDrawer'
import TokenTable from 'components/InfoTokens/TokenTable/TokenTable'
import { MAX_WIDTH_MEDIA_BREAKPOINT } from 'components/Tokens/constants'
import { filterStringAtom } from 'components/Tokens/state'
import { MouseoverTooltip } from 'components/Tooltip'
import { RNG_ADDRESS } from 'constants/tokens'
import useTokenTransfers from 'hooks/useTokenTransfers'
import { useResetAtom } from 'jotai/utils'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePoolDatas } from 'state/pools/hooks'
import { usePoolsForToken } from 'state/tokens/hooks'
import styled from 'styled-components'
import { ThemedText } from 'theme'
import { TRANSITION_DURATIONS } from 'theme/styles'
import { formatNumber, NumberType } from 'utils/formatNumbers'

import one from '../../assets/home/1.svg'
import two from '../../assets/home/2.svg'
import three from '../../assets/home/3.svg'
import four from '../../assets/home/4.svg'

const PageContainer = styled.div`
  position: absolute;
  top: 0;
  padding: ${({ theme }) => theme.navHeight}px 0px 0px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  scroll-behavior: smooth;
  overflow-x: hidden;
`

const ExploreContainer = styled.div`
  width: 100%;
  min-width: 320px;
  padding: 68px 12px 0px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
`
const TitleContainer = styled.div`
  margin-bottom: 32px;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin-left: auto;
  margin-right: auto;
  display: flex;
`

export default function InfoTokens() {
  const resetFilterString = useResetAtom(filterStringAtom)
  const location = useLocation()

  useEffect(() => {
    resetFilterString()
  }, [location, resetFilterString])

  const poolsForToken = usePoolsForToken(RNG_ADDRESS)
  const poolDatas = usePoolDatas(poolsForToken ?? [])

  const { data } = useTokenTransfers()
  const tokenTransfers = data?.count

  const infoTokens = useMemo(() => {
    if (!poolDatas) {
      return undefined
    }

    const totaltvlUSD = poolDatas.reduce((sum, token) => sum + token.tvlUSD, 0)
    const totalvolumeUSD = poolDatas.reduce((sum, token) => sum + token.volumeUSD, 0)
    const pools = poolDatas.length
    return { totaltvlUSD, totalvolumeUSD, pools }
  }, [poolDatas])

  const [accountDrawerOpen] = useAccountDrawer()
  const navigate = useNavigate()
  useEffect(() => {
    if (accountDrawerOpen) {
      setTimeout(() => {
        navigate('/swap')
      }, TRANSITION_DURATIONS.fast)
    }
  }, [accountDrawerOpen, navigate])

  return (
    <Trace page={InterfacePageName.TOKENS_PAGE} shouldLogImpression>
      <PageContainer data-testid="ring-page">
        <ExploreContainer>
          <div className="w-full mx-auto max-w-[1200px] md:pb-8 pb-0">
            <section className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start mb-12">
              <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
                <div className="flex flex-col">
                  <h1 className="scroll-m-20 text-3xl font-bold tracking-tighter md:text-5xl lg:leading-[1.1]">
                    List your tokens on DEX <br />
                    Traded by millions of users.
                  </h1>
                  <p className="scroll-m-20 leading-7 [:not(:first-child)]:mt-6 text-lg text-muted-foreground sm:text-xl max-w-[500px] mt-4">
                    Ring Exchange enables single side liquidity provision on Decentralized Exchange. <br /> Allowing
                    Web3.0 users trade your tokens freely and openly without creating account.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row w-full sm:w-[unset] gap-4">
                  <div className="flex items-center w-full">
                    <div className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue-400 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-600 text-white min-h-[44px] h-[44px] px-4 rounded-xl flex-1 w-full sm:flex-0 sm:w-[unset] rounded-r-none">
                      <a href="https://forms.gle/a777EUMn7UpzXjFe9" className="text-white">
                        I want to list a token on Ring Exchange
                      </a>
                    </div>
                    <div
                      className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue-400 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-600 text-white min-h-[44px] h-[44px] px-4 rounded-xl rounded-l-none"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      data-state="closed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        width="16"
                        height="16"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-8 gap-4 max-w-[1200px] mx-auto mb-6">
            <div className="flex justify-between rounded-xl bg-slate-100 dark:bg-[#2C2F36] p-4">
              <div>
                <img src={one} className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div className="text-3xl">{formatNumber(infoTokens?.totaltvlUSD, NumberType.FiatTokenStats)}</div>
                <div className="text-gray-400">TVL</div>
              </div>
            </div>
            <div className="flex justify-between rounded-xl bg-slate-100 dark:bg-[#2C2F36] p-4">
              <div>
                <img src={two} className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div className="text-3xl">{formatNumber(infoTokens?.totalvolumeUSD, NumberType.FiatTokenStats)}</div>
                <div className="text-gray-400">24H Volume</div>
              </div>
            </div>
            <div className="flex justify-between rounded-xl bg-slate-100 dark:bg-[#2C2F36] p-4">
              <div>
                <img src={three} className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div className="text-3xl">{infoTokens?.pools}</div>
                <div className="text-gray-400">Trading Pairs</div>
              </div>
            </div>
            <div className="flex justify-between rounded-xl bg-slate-100 dark:bg-[#2C2F36] p-4">
              <div>
                <img src={four} className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-between py-2">
                <div className="text-3xl">{formatNumber(tokenTransfers, NumberType.NFTCollectionStats)}</div>
                <div className="text-gray-400">Transcations</div>
              </div>
            </div>
          </div>
          <TitleContainer>
            <MouseoverTooltip
              text={<Trans>This table contains the top tokens by Ring Exchange volume.</Trans>}
              placement="bottom"
            >
              <ThemedText.LargeHeader>
                <Trans>Top tokens on Ring Exchange</Trans>
              </ThemedText.LargeHeader>
            </MouseoverTooltip>
          </TitleContainer>
          <TokenTable poolsForToken={poolsForToken ?? []} />
        </ExploreContainer>
      </PageContainer>
    </Trace>
  )
}
