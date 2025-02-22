import { createSlice } from "@reduxjs/toolkit";

interface SearchState {
  value: string;
}

export interface SearchStateRoot {
  searchText: {
    value: string;
  };
}

const initialState: SearchState = {
  value: "",
};

export const searchSlice = createSlice({
  name: "searchText",
  initialState: initialState,
  reducers: {
    setSearch: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
