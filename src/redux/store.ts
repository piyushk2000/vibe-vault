import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import searchReducer from './searchSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    searchText: searchReducer,
  },
})