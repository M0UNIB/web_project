function NoteForm({ form, onChange, onSubmit, onCancel, onReset, isSaving, editingNote }) {
  return (
    <form className="note-form card" onSubmit={onSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Editor</p>
          <h2>{editingNote ? 'Update note' : 'Add a new note'}</h2>
        </div>
        {editingNote ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <label>
        <span>Title</span>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={onChange}
          maxLength="100"
          placeholder="Remember to finish the project report"
          required
        />
      </label>

      <label>
        <span>Content</span>
        <textarea
          name="content"
          value={form.content}
          onChange={onChange}
          rows="6"
          placeholder="Add any details, links, or reminders here..."
        />
      </label>

      <label>
        <span>Priority</span>
        <select name="priority" value={form.priority} onChange={onChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isSaving}>
          {isSaving ? 'Saving...' : editingNote ? 'Save changes' : 'Create note'}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </form>
  )
}

export default NoteForm
