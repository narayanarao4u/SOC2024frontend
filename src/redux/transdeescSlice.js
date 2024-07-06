import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransDescs = createAsyncThunk(
  "transdesc/fetchTransDescs",
  async (url, { getState, rejectWithValue }) => {
    console.log(url);
    // console.log("getState", getState());
    try {
      const response = await axios.get(url);
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const transDescSlice = createSlice({
  name: "transdesc",
  initialState: {
    transdesc: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransDescs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransDescs.fulfilled, (state, action) => {
        // console.log("action.payload", action.payload);
        state.status = "succeeded";
        state.transdesc = action.payload;
      })
      .addCase(fetchTransDescs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export default transDescSlice.reducer;

/*
e

  extraReducers: {
    [fetchTransDescs.pending]: (state) => {
      state.status = "loading";
    },
    [fetchTransDescs.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.transdesc = action.payload;
    },
    [fetchTransDescs.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },

*/
