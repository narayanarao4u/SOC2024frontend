import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTrans = createAsyncThunk("Trans/fetchTrans", async (url) => {
  // console.log("trans-url", url);
  const response = await axios.get(url);
  return response.data;
});

export const createTrans = createAsyncThunk("Trans/createTrans", async ({ url, data }) => {
  const response = await axios.post(url, data);
  return response.data;
});

export const updateTrans = createAsyncThunk("Trans/updateTrans", async ({ url, id, data }) => {
  const response = await axios.put(`${url}/${id}`, data);
  return response.data;
});

export const deleteTrans = createAsyncThunk("Trans/deleteTrans", async ({ url, id }) => {
  await axios.delete(`${url}/${id}`);
  return id;
});

const initialState = {
  data: [],
  status: "idle",
  error: null,
  selected: null,
};
const transSlice = createSlice({
  name: "memdata",
  initialState,
  reducers: {
    selectPost: (state, action) => {
      state.selected = action.payload;
    },
    filterPosts: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchTrans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createTrans.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateTrans.fulfilled, (state, action) => {
        const index = state.data.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteTrans.fulfilled, (state, action) => {
        state.data = state.data.filter((post) => post.id !== action.payload);
      });
  },
});

export default transSlice.reducer;
