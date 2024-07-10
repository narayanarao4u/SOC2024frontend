import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (url) => {
  const response = await axios.get(url);
  return response.data;
});

export const createPost = createAsyncThunk("posts/createPost", async ({ url, data }) => {
  const response = await axios.post(url, data);
  return response.data;
});

export const updatePost = createAsyncThunk("posts/updatePost", async ({ url, id, data }) => {
  const response = await axios.put(`${url}/${id}`, data);
  return response.data;
});

export const deletePost = createAsyncThunk("posts/deletePost", async ({ url, id }) => {
  await axios.delete(`${url}/${id}`);
  return id;
});

const initialState = {
  members: [],
  status: "idle",
  error: null,
  selected: null,
};
const memdataSlice = createSlice({
  name: "memdata",
  initialState,
  reducers: {
    selectPost: (state, action) => {
      state.selected = action.payload;
    },
    filterPosts: (state, action) => {
      state.members = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.members = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.members.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.members = state.members.filter((post) => post.id !== action.payload);
      });
  },
});

export default memdataSlice.reducer;
