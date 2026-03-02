import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = id => {
    dispatch({
      type: 'VOTE',
      payload: id
    })
  }

  const newAnecdote = (event) => {
    event.preventDefault()
    dispatch({
      type: 'NEW_ANECDOTE',
      payload: {
        content: event.target.anecdote.value,
        id: (Math.random()*100000).toFixed(0),
        votes: 0
      }
    })
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div>
          <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default App
