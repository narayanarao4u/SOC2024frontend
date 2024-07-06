import { configureStore } from "@reduxjs/toolkit";
import memdataSlice from "./memdataSlice";
import accountSlice from "./accountSlice";
import transdeescSlice from "./transdeescSlice";

export const store = configureStore({
  reducer: {
    memdata: memdataSlice,
    acdata: accountSlice,
    transDesc: transdeescSlice,
  },
});
