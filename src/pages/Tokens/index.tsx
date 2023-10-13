import { Trans } from '@lingui/macro'
import { InterfacePageName } from '@uniswap/analytics-events'
import { Trace } from 'analytics'
import { MAX_WIDTH_MEDIA_BREAKPOINT, MEDIUM_MEDIA_BREAKPOINT } from 'components/Tokens/constants'
import { filterStringAtom } from 'components/Tokens/state'
import NetworkFilter from 'components/Tokens/TokenTable/NetworkFilter'
import SearchBar from 'components/Tokens/TokenTable/SearchBar'
import TimeSelector from 'components/Tokens/TokenTable/TimeSelector'
import TokenTable from 'components/Tokens/TokenTable/TokenTable'
import { MouseoverTooltip } from 'components/Tooltip'
import { useTokenQuery } from 'graphql/data/__generated__/types-and-hooks'
import { validateUrlChainParam } from 'graphql/data/util'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ThemedText } from 'theme'
import { formatNumber, NumberType } from 'utils/formatNumbers'

import one from '../../assets/home/1.svg'
import two from '../../assets/home/2.svg'
import three from '../../assets/home/3.svg'
import four from '../../assets/home/4.svg'

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
const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 40px;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    order: 2;
  }
`
const SearchContainer = styled(FiltersContainer)`
  margin-left: 8px;
  width: 100%;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    margin: 0px;
    order: 1;
  }
`
const FiltersWrapper = styled.div`
  display: flex;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin: 0 auto;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.neutral3};
  flex-direction: row;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
  }
`

const Tokens = () => {
  const resetFilterString = useResetAtom(filterStringAtom)
  const location = useLocation()
  const { chainName } = useParams<{
    tokenAddress: string
    chainName?: string
  }>()
  const chain = validateUrlChainParam(chainName)
  const { data: tokenQuery } = useTokenQuery({
    variables: {
      address: '0x3b94440c8c4f69d5c9f47bab9c5a93064df460f5',
      chain,
    },
    errorPolicy: 'all',
  })
  const tokenQueryData = tokenQuery?.token

  useEffect(() => {
    resetFilterString()
  }, [location, resetFilterString])

  return (
    <Trace page={InterfacePageName.TOKENS_PAGE} shouldLogImpression>
      <ExploreContainer>
        <div className="w-full mx-auto max-w-[1200px] pb-10">
          <section className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start mb-12">
            <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
              <div className="flex flex-col">
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tighter md:text-5xl lg:leading-[1.1]">
                  Put your funds to work <br />
                  by providing liquidity.
                </h1>
                <p className="scroll-m-20 leading-7 [:not(:first-child)]:mt-6 text-lg text-muted-foreground sm:text-xl max-w-[500px] mt-4">
                  When you add liquidity to a pool, you can receive a share of its trading volume and potentially snag
                  extra rewards when there are incentives involved!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row w-full sm:w-[unset] gap-4">
                <div className="flex items-center w-full">
                  <div className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue-400 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-600 text-white min-h-[44px] h-[44px] px-4 rounded-xl flex-1 w-full sm:flex-0 sm:w-[unset] rounded-r-none">
                    <a href="#" className="text-white">
                      I want to create a position
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
                <div className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue-400 bg-[#2C2F36] hover:bg-muted focus:bg-accent min-h-[44px] h-[44px] px-4 rounded-xl flex-1 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    ></path>
                  </svg>
                  <a href="#" className="text-white">
                    I want to incentivize a pool
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 lg:items-end">
              <div className="flex flex-col items-center gap-1 lg:items-end">
                <span className="font-semibold lg:text-sm">Looking for a partnership with Few?</span>
                <div className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue text-blue hover:underline hover:text-blue-700 hover:font-semibold !p-0 !h-[unset] !min-h-[unset] min-h-[36px] h-[36px] px-3 text-sm rounded-xl flex-1 w-full sm:flex-0 sm:w-[unset]">
                  <a href="/partner">Apply here</a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 lg:items-end">
                <span className="font-semibold lg:text-sm">Need Help?</span>
                <div className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-blue text-blue hover:underline hover:text-blue-700 hover:font-semibold !p-0 !h-[unset] !min-h-[unset] min-h-[36px] h-[36px] px-3 text-sm rounded-xl">
                  <svg
                    viewBox="0 0 256 199"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    className="w-[18px] h-[18px]"
                  >
                    <g>
                      <path
                        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                        fill="currentColor"
                        fillRule="nonzero"
                      ></path>
                    </g>
                  </svg>
                  <a
                    href="https://discord.gg/NVPXN4e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-blue hover:underline"
                  >
                    Join our discord
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 lg:gap-8 gap-4 max-w-[1200px] mx-auto mb-6">
          <div className="flex justify-between rounded-xl bg-[#2C2F36] p-4">
            <div>
              <img src={one} className="w-20 h-20" />
            </div>
            <div className="flex flex-col justify-between py-2">
              <div className="text-3xl">
                {formatNumber(tokenQueryData?.market?.totalValueLocked?.value, NumberType.FiatTokenStats)}
              </div>
              <div className="text-gray-400">TVL</div>
            </div>
          </div>
          <div className="flex justify-between rounded-xl bg-[#2C2F36] p-4">
            <div>
              <img src={two} className="w-20 h-20" />
            </div>
            <div className="flex flex-col justify-between py-2">
              <div className="text-3xl">
                {formatNumber(tokenQueryData?.market?.volume24H?.value, NumberType.FiatTokenStats)}
              </div>
              <div className="text-gray-400">24H Volume</div>
            </div>
          </div>
          <div className="flex justify-between rounded-xl bg-[#2C2F36] p-4">
            <div>
              <img src={three} className="w-20 h-20" />
            </div>
            <div className="flex flex-col justify-between py-2">
              <div className="text-3xl">25</div>
              <div className="text-gray-400">Pools</div>
            </div>
          </div>
          <div className="flex justify-between rounded-xl bg-[#2C2F36] p-4">
            <div>
              <img src={four} className="w-20 h-20" />
            </div>
            <div className="flex flex-col justify-between py-2">
              <div className="text-3xl">8.3K</div>
              <div className="text-gray-400">Transcations</div>
            </div>
          </div>
        </div>
        <TitleContainer>
          <MouseoverTooltip
            text={<Trans>This table contains the top tokens by Uniswap volume, sorted based on your input.</Trans>}
            placement="bottom"
          >
            <ThemedText.LargeHeader>
              <Trans>Top tokens on Uniswap</Trans>
            </ThemedText.LargeHeader>
          </MouseoverTooltip>
        </TitleContainer>
        <FiltersWrapper>
          <FiltersContainer>
            <NetworkFilter />
            <TimeSelector />
          </FiltersContainer>
          <SearchContainer>
            <SearchBar />
          </SearchContainer>
        </FiltersWrapper>
        <TokenTable />
      </ExploreContainer>
    </Trace>
  )
}

export default Tokens
