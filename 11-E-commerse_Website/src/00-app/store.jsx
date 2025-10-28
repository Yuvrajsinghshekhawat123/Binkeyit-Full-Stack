// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";

import userReducer from "../03-features/auth/hook/01-useSlice.js";
import userDetailReducer from "./01-userSlice.js";
import catalogReducer from "./02-catalogSlice.js";
import cartReducer from "./03-cartSlice.js"
const rootReducer = combineReducers({
  user: userReducer,
  userDetail: userDetailReducer,
  catalog: catalogReducer,
  cart:cartReducer,

});

// persist config
const persistConfig = {
  key: "root",
  storage, // localStorage
  whitelist: ["user", "catalog","cart"], // ✅ which reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // must be false for redux-persist
    }),
});

export const persistor = persistStore(store);

/*
🔹 1. LocalStorage (manual use)
    . You directly use browser’s API:
            localStorage.setItem("user", JSON.stringify(user));
          const user = JSON.parse(localStorage.getItem("user"));
    .You have to manually save, update, and remove data each time something changes.
    .No automatic sync with Redux.
    . If your Redux state updates, localStorage does not automatically update — you must write extra cod

  


🔹 2. redux-persist (with whitelist)
      . Built on top of localStorage (or sessionStorage, IndexedDB, etc.).
      . Automatically:
          . Saves slices (reducers) to storage whenever they change.
          . Restores them into Redux store after a refresh.
      . You can control which slices are persisted with:
          .whitelist: only save specific slices
          .blacklist: save everything except listed slices

      . Handles rehydration (loading persisted state back into Redux on app startup).




*/
