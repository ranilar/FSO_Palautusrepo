import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (content) => ({
  content,
  id: getId(),
  votes: 0
})

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const anecdote = state.find(x => x.id === action.payload)
      anecdote.votes += 1
      state.sort((x, y) => y.votes - x.votes)
    },

    createAnecdote(state, action) {
      state.push(action.payload)
      state.sort((x, y) => y.votes - x.votes)
    },

    initializeAnecdotes(state, action) {
      return action.payload.sort((x, y) => y.votes - x.votes)
    }
  }
})

export const { voteAnecdote, createAnecdote, initializeAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer