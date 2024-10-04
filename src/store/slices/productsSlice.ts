import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  images: string[],
  availabilityStatus: string,
  rating: number,
  price: number;
  isEditing?: boolean;
}

type PaginationData = { limit: number; skip: number }

interface ProductsState {
  items: Product[];
  selectedItems: number[];
  limit: number;
  skip: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ProductsState = {
  items: [],
  selectedItems: [],
  limit: 10,
  skip: 0,
  status: 'idle',
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ limit, skip }: PaginationData) => {
  const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  return response.data.products;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleSelect: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedItems.includes(id)) {
        state.selectedItems = state.selectedItems.filter((itemId) => itemId !== id);
      } else {
        state.selectedItems.push(id);
      }
    },
    deleteSelected: (state) => {
      state.items = state.items.filter((item) => !state.selectedItems.includes(item.id));
      state.selectedItems = [];
    },
    startEditing: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) item.isEditing = true;
    },
    saveEdit: (state, action: PayloadAction<{ id: number; updatedData: Partial<Product> }>) => {
      const { id, updatedData } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        Object.assign(item, updatedData);
        item.isEditing = false;
      }
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSkip: (state, action: PayloadAction<number>) => {
      state.skip = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload.map((item) => ({ ...item, isEditing: false }));
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { toggleSelect, deleteSelected, startEditing, saveEdit, setLimit, setSkip } = productsSlice.actions;

export default productsSlice.reducer;