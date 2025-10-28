import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}, //  // { productId: { count,name, image, unit, price,discount } }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const { productId, name, image, unit, price, discount } = action.payload;
      if (
        productId && // must have a valid ID
        !state.items[productId] && // not already in cart
        name && // must have a name
        image && // must have an image
        unit && // must have a unit
        price !== undefined &&
        price !== null // must have a valid price
      ) {
        state.items[productId] = {
          count: 1,
          name,
          image,
          unit,
          price,
          discount: discount ?? 0, // default 0 if undefined
        };
      }
    },

    increaseItem: (state, action) => {
      const productId = action.payload;
      if (state.items[productId]) {
        state.items[productId].count += 1;
      }
    },

    decreaseItem: (state, action) => {
      const productId = action.payload;
      const item = state.items[productId];

      if (!item) return; // Product not in cart

      if (item.count <= 1) {
        delete state.items[productId]; // Remove if count reaches 0
      } else {
        item.count -= 1;
      }
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, increaseItem, decreaseItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
