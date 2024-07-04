import { configureStore } from "@reduxjs/toolkit";
import memdataSlice from "./memdataSlice";
import accountSlice from "./accountSlice";

export const store = configureStore({
  reducer: {
    memdata: memdataSlice,
    acdata: accountSlice,
  },
});
