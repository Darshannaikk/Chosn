import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import { authSlice } from './slices/auth-slice';
import { userSlice } from './slices/user-slice';
import { matchingSlice } from './slices/matching-slice';
import messagingReducer from './slices/messaging-slice';

// Create noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage in browser, noop storage on server
const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default
  : createNoopStorage();

// Redux Persist configuration
const persistConfig = {
  key: 'chosn-root',
  storage,
  whitelist: ['auth', 'user'], // Only persist auth and user data
  blacklist: ['matching'], // Don't persist matching data (should be fresh)
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  user: userSlice.reducer,
  matching: matchingSlice.reducer,
  messaging: messagingReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PURGE',
          'persist/FLUSH',
          'persist/PAUSE',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;