import { combineReducers } from '@reduxjs/toolkit'
import multicall from 'lib/state/multicall'
import localForage from 'localforage'
import { PersistConfig, persistReducer } from 'redux-persist'
import { isDevelopmentEnv } from 'utils/env'

import application from './application/reducer'
import burn from './burn/reducer'
import burnV3 from './burn/v3/reducer'
import infoapplication from './infoapplication/reducer'
import lists from './lists/reducer'
import logs from './logs/slice'
import { customCreateMigrate, migrations } from './migrations'
import mint from './mint/reducer'
import mintV3 from './mint/v3/reducer'
import pools from './pools/reducer'
import { routingApi } from './routing/slice'
import signatures from './signatures/reducer'
import tokens from './tokens/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallets from './wallets/reducer'

const persistedReducers = {
  user,
  transactions,
  signatures,
  lists,
}

const appReducer = combineReducers({
  application,
  infoapplication,
  pools,
  tokens,
  wallets,
  mint,
  mintV3,
  burn,
  burnV3,
  multicall: multicall.reducer,
  logs,
  [routingApi.reducerPath]: routingApi.reducer,
  ...persistedReducers,
})

export type AppState = ReturnType<typeof appReducer>

const persistConfig: PersistConfig<AppState> = {
  key: 'interface',
  version: 0, // see migrations.ts for more details about this version
  storage: localForage.createInstance({
    name: 'redux',
  }),
  migrate: customCreateMigrate(migrations, { debug: false }),
  whitelist: Object.keys(persistedReducers),
  throttle: 1000, // ms
  serialize: false,
  // The typescript definitions are wrong - we need this to be false for unserialized storage to work.
  // We need unserialized storage for inspectable db entries for debugging.
  // @ts-ignore
  deserialize: false,
  debug: isDevelopmentEnv(),
}

const persistedReducer = persistReducer(persistConfig, appReducer)

export default persistedReducer
