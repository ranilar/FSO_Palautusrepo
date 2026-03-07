import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdoteService from './services/anecdoteService'

const App = () => {
  const queryClient = useQueryClient()
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAnecdotes,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, anecdote }) => 
      anecdoteService.updateAnecdote(id, { ...anecdote, votes: anecdote.votes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate({ id: anecdote.id, anecdote })
  }

  if (result.isLoading) return <div>loading...</div>
  if (result.isError) return <div>anecdote app failed due to server error</div>

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
