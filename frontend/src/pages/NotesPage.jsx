import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteForm from '../components/NoteForm'
import NoteItem from '../components/NoteItem'
import StatusAlert from '../components/StatusAlert'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const emptyForm = {
  title: '',
  content: '',
  priority: 'medium',
}

function NotesPage() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuth()
  const [notes, setNotes] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingNote, setEditingNote] = useState(null)
  const [feedback, setFeedback] = useState({ status: 'success', message: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleUnauthorized = async () => {
    await clearAuth()
    navigate('/login')
  }

  const fetchNotes = async () => {
    setIsLoading(true)

    try {
      const { data } = await api.get('/notes')
      setNotes(data)
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized()
        return
      }

      setFeedback({
        status: 'error',
        message: 'Unable to load notes right now.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter
    const haystack = `${note.title} ${note.content ?? ''}`.toLowerCase()
    const matchesSearch = haystack.includes(searchTerm.toLowerCase())
    return matchesPriority && matchesSearch
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetEditor = () => {
    setEditingNote(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setFeedback({ status: 'success', message: '' })

    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote.id}`, form)
        setFeedback({ status: 'success', message: 'Note updated successfully.' })
      } else {
        await api.post('/notes', form)
        setFeedback({ status: 'success', message: 'Note created successfully.' })
      }

      resetEditor()
      await fetchNotes()
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized()
        return
      }

      const validationErrors = error.response?.data?.errors
      const message = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : error.response?.data?.message || 'Unable to save the note.'

      setFeedback({
        status: 'error',
        message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setForm({
      title: note.title,
      content: note.content ?? '',
      priority: note.priority,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (note) => {
    const confirmed = window.confirm(`Delete "${note.title}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/notes/${note.id}`)
      setFeedback({ status: 'success', message: 'Note deleted successfully.' })
      await fetchNotes()
    } catch (error) {
      if (error.response?.status === 401) {
        await handleUnauthorized()
        return
      }

      setFeedback({
        status: 'error',
        message: error.response?.status === 404 ? 'This note no longer exists.' : 'Unable to delete the note.',
      })
    }
  }

  return (
    <main className="notes-shell">
      <section className="hero-banner">
        <div>
          <p className="eyebrow">Authenticated workspace</p>
          <h1>{user?.name}'s notes dashboard</h1>
          <p>
            Create, edit, search, and prioritize personal notes without leaving the page.
          </p>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={async () => {
            await clearAuth()
            navigate('/login')
          }}
        >
          Logout
        </button>
      </section>

      <StatusAlert {...feedback} onClose={() => setFeedback({ status: 'success', message: '' })} />

      <section className="notes-grid">
        <NoteForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetEditor}
          onReset={resetEditor}
          isSaving={isSaving}
          editingNote={editingNote}
        />

        <section className="notes-list card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your notes</p>
              <h2>{filteredNotes.length} item(s)</h2>
            </div>
          </div>

          <div className="filters">
            <label>
              <span>Search</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find a title or keyword"
              />
            </label>

            <label>
              <span>Priority</span>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="all">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          {isLoading ? <p className="screen-message">Loading notes...</p> : null}

          {!isLoading && filteredNotes.length === 0 ? (
            <div className="empty-state">
              <h3>No notes match the current filters.</h3>
              <p>Try another keyword or create your first note from the editor.</p>
            </div>
          ) : null}

          <div className="note-stack">
            {filteredNotes.map((note) => (
              <NoteItem key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default NotesPage
