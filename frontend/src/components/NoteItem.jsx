function NoteItem({ note, onEdit, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="note-card">
      <div className="note-card__header">
        <div>
          <span className={`priority-badge priority-badge--${note.priority}`}>
            {note.priority}
          </span>
          <h3>{note.title}</h3>
        </div>
        <p>{formattedDate}</p>
      </div>

      <p className="note-card__content">
        {note.content?.trim() || 'No details added for this note yet.'}
      </p>

      <div className="note-card__actions">
        <button type="button" className="secondary-button" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button type="button" className="danger-button" onClick={() => onDelete(note)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default NoteItem
