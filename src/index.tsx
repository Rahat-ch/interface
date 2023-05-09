import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'tracing'

import { ApolloProvider } from '@apollo/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import Web3Provider from './components/Web3Provider'
import { SmartAccountProvider } from './contexts/SmartAccountContext'
import { Web3AuthProvider } from './contexts/SocialLoginContext'
import { FeatureFlagsProvider } from './featureFlags'
import { apolloClient } from './graphql/data/apollo'
import { LanguageProvider } from './i18n'
import { BlockNumberProvider } from './lib/hooks/useBlockNumber'
import { MulticallUpdater } from './lib/state/multicall'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import TransactionUpdater from './state/transactions/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/components/RadialGradientByChainUpdater'
import { SystemThemeUpdater } from './theme/components/ThemeToggle'

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
      <MulticallUpdater />
      <LogsUpdater />
    </>
  )
}

const queryClient = new QueryClient()

const container = document.getElementById('root') as HTMLElement

createRoot(container).render(
  <StrictMode>
    <Web3AuthProvider>
      <SmartAccountProvider>
        <Provider store={store}>
          <FeatureFlagsProvider>
            <QueryClientProvider client={queryClient}>
              <HashRouter>
                <LanguageProvider>
                  <Web3Provider>
                    <ApolloProvider client={apolloClient}>
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
      </SmartAccountProvider>
    </Web3AuthProvider>
  </StrictMode>
)

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register()
}
