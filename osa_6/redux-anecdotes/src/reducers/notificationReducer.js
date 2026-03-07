import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationSet(state, action) {
      return action.payload
    },
    notificationClear() {
      return ''
    }
  }
})

const { notificationSet, notificationClear } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(notificationSet(message))
    setTimeout(() => {
      dispatch(notificationClear())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer