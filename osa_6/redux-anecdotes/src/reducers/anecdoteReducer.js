import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

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

    setAnecdotes(state, action) {
      return action.payload.sort((x, y) => y.votes - x.votes)
    }
  }
})

const { setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const { voteAnecdote, createAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer