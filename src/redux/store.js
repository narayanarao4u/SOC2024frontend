import { configureStore } from "@reduxjs/toolkit";
import memdataSlice from "./memdataSlice";
import accountSlice from "./accountSlice";

import transSlice from "./transSlice";
import transDescSlice from "./transDescSlice";

export const store = configureStore({
  reducer: {
    memdata: memdataSlice,
    acdata: accountSlice,
    transDesc: transDescSlice,
    trans: transSlice,
  },
});
