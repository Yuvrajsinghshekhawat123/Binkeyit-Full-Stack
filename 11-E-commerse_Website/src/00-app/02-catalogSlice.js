import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  subCategories: [],
  products: [],
  isLoading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    resetState: () => initialState,
  },
});

export const {
    setCategories,
  setSubCategories,
  setProducts,
  setLoading,
  setError,
  resetState,
} = catalogSlice.actions;

export default catalogSlice.reducer;
