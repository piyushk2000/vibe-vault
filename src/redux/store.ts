import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import searchReducer from './searchSlice'
import loadingReducer from './loadingSlice'
import authReducer from './authSlice'
import mediaReducer from './mediaSlice'
import profileReducer from './profileSlice'
import swipeReducer from './swipeSlice'
import connectionReducer from './connectionSlice'
import matchRequestReducer from './matchRequestSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    searchText: searchReducer,
    loading: loadingReducer,
    auth: authReducer,
    media: mediaReducer,
    profile: profileReducer,
    swipe: swipeReducer,
    connection: connectionReducer,
    matchRequest: matchRequestReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store