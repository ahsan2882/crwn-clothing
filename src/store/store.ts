import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";
import localStorage from "redux-persist/es/storage";

import { rootReducer } from "./root-reducer";

const persistConfig = {
  key: "root",
  storage: localStorage,
  blacklist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV !== "production"
      ? getDefaultMiddleware({
          serializableCheck: false,
        }).concat(logger)
      : getDefaultMiddleware(),
});

export const persistor = persistStore(store);
