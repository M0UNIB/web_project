function StatusAlert({ status, message, onClose }) {
  if (!message) {
    return null
  }

  return (
    <div className={`status-alert status-alert--${status}`}>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss message">
        x
      </button>
    </div>
  )
}

export default StatusAlert
