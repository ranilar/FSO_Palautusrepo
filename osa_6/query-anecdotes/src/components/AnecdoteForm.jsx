import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdoteService'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const { setNotification } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: anecdoteService.createAnecdote,
    onSuccess: (data, content) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      setNotification(`'${content}' created`)
    },
    onError: () => {
      setNotification('too short')
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    if (content.length < 5) {
      setNotification('too short')
      return
    }
    
    createMutation.mutate(content)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
