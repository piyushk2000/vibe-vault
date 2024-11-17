import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import searchReducer from './searchSlice'
import loadingReducer from './loadingSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    searchText: searchReducer,
    isLoading: loadingReducer,
    loading: loadingReducer,
  },
})