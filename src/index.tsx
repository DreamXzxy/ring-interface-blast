import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'tracing'
import './index.css'

import { ApolloProvider } from '@apollo/client'
import { healthClient } from 'apollo/client'
import { FeatureFlagsProvider } from 'featureFlags'
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'
import { MulticallUpdater } from 'lib/state/multicall'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { SystemThemeUpdater } from 'theme/components/ThemeToggle'

import Web3Provider from './components/Web3Provider'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import InfoapplicationUpdater from './state/infoapplication/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import PoolsUpdater from './state/pools/updater'
import OrderUpdater from './state/signatures/updater'
import TokensUpdater from './state/tokens/updater'
import TransactionUpdater from './state/transactions/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/components/RadialGradientByChainUpdater'

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <SystemThemeUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <OrderUpdater />
      <MulticallUpdater />
      <LogsUpdater />
      <TokensUpdater />
      <PoolsUpdater />
      <InfoapplicationUpdater />
    </>
  )
}

const queryClient = new QueryClient()

const container = document.getElementById('root') as HTMLElement

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <FeatureFlagsProvider>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <LanguageProvider>
              <Web3Provider>
                <ApolloProvider client={healthClient}>
                  <BlockNumberProvider>
                    <Updaters />
                    <ThemeProvider>
                      <ThemedGlobalStyle />
                      <App />
                    </ThemeProvider>
                  </BlockNumberProvider>
                </ApolloProvider>
              </Web3Provider>
            </LanguageProvider>
          </HashRouter>
        </QueryClientProvider>
      </FeatureFlagsProvider>
    </Provider>
  </StrictMode>
)

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register()
}
