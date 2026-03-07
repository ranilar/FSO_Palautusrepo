import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdoteService'

const AnecdoteForm = () => {
  const [notification, setNotification] = useState('')
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: anecdoteService.createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      setNotification('too short')
      setTimeout(() => setNotification(''), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    if (content.length < 5) {
      setNotification('too short')
      setTimeout(() => setNotification(''), 5000)
      return
    }
    
    createMutation.mutate(content, {
      onSuccess: () => {
        setNotification(`'${content}' created`)
        setTimeout(() => setNotification(''), 5000)
        event.target.anecdote.value = ''
      }
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
      {notification && <div style={{ color: 'red' }}>{notification}</div>}
    </div>
  )
}

export default AnecdoteForm
