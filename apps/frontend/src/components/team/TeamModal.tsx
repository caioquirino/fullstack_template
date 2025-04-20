import { useEffect } from 'react'
import { TeamMember } from './types'
import { Modal } from '@/components/shared/Modal'
import { formStyles } from '@/components/shared/FormStyles'

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  title: string
  member: Partial<TeamMember>
  onChange: (field: keyof TeamMember, value: string) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function TeamModal({ isOpen, onClose, onSubmit, title, member, onChange, inputRef }: TeamModalProps) {
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, inputRef])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Name</label>
          <input type="text" ref={inputRef} value={member.name || ''} onChange={(e) => onChange('name', e.target.value)} className={formStyles.input} required />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Email</label>
          <input type="email" value={member.email || ''} onChange={(e) => onChange('email', e.target.value)} className={formStyles.input} required />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.label}>Role</label>
          <select value={member.role || 'Read'} onChange={(e) => onChange('role', e.target.value)} className={formStyles.select} required>
            <option value="Admin">Admin</option>
            <option value="Edit">Edit</option>
            <option value="Read">Read</option>
          </select>
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
