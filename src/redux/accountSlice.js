import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchACs = createAsyncThunk("ACs/fetchACs", async (url) => {
  console.log('account' , url);
  const response = await axios.get(url);
  return response.data;
});

export const createAC = createAsyncThunk("ACs/createAC", async ({ url, data }) => {
  const response = await axios.AC(url, data);
  return response.data;
});

export const updateAC = createAsyncThunk("ACs/updateAC", async ({ url, id, data }) => {
  const response = await axios.put(`${url}/${id}`, data);
  return response.data;
});

export const deleteAC = createAsyncThunk("ACs/deleteAC", async ({ url, id }) => {
  await axios.delete(`${url}/${id}`);
  return id;
});

const initialState =  {
  data: [],
  status: "idle",
  error: null,
  selected: null,

}
const accountSlice = createSlice({
  name: "acdata",
  initialState,
  reducers: {
    selectAC: (state, action) => {      
      state.selected = action.payload;      
    },
    filterACs: (state, action) => {      
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchACs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchACs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchACs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createAC.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateAC.fulfilled, (state, action) => {
        const index = state.data.findIndex((AC) => AC.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteAC.fulfilled, (state, action) => {
        state.data = state.data.filter((AC) => AC.id !== action.payload);
      });
  },
});



export default accountSlice.reducer;
