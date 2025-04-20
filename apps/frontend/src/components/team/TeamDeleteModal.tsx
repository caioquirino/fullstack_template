import { TeamMember } from './types'
import { Modal } from '@/components/shared/Modal'
import { formStyles } from '@/components/shared/FormStyles'

interface TeamDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  member: TeamMember | null
  buttonRef: React.RefObject<HTMLButtonElement>
}

export function TeamDeleteModal({ isOpen, onClose, onConfirm, member, buttonRef }: TeamDeleteModalProps) {
  if (!member) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team Member" buttonRef={buttonRef}>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete {member.name}? This action cannot be undone.</p>
      </div>
      <div className={formStyles.buttonGroup}>
        <button type="button" onClick={onClose} className={formStyles.cancelButton}>
          Cancel
        </button>
        <button ref={buttonRef} type="button" onClick={onConfirm} className={formStyles.deleteButton}>
          Delete
        </button>
      </div>
    </Modal>
  )
}
