import { useEffect } from 'react'
import { JargonTerm } from './types'
import { Modal } from '@/components/shared/Modal'
import { formStyles } from '@/components/shared/FormStyles'

interface JargonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  title: string
  term: Partial<JargonTerm>
  onChange: (field: keyof JargonTerm, value: string) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function JargonModal({ isOpen, onClose, onSubmit, title, term, onChange, inputRef }: JargonModalProps) {
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, inputRef])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Term</label>
          <input type="text" ref={inputRef} value={term.term || ''} onChange={(e) => onChange('term', e.target.value)} className={formStyles.input} required />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Description</label>
          <textarea value={term.description || ''} onChange={(e) => onChange('description', e.target.value)} className={formStyles.textarea} rows={3} required />
        </div>
        <div className={formStyles.buttonGroup}>
          <button type="button" onClick={onClose} className={formStyles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={formStyles.submitButton}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
