import { Modal } from '@/components/shared/Modal'
import { formStyles } from '@/components/shared/FormStyles'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  itemName: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, title, itemName }: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete {itemName}? This action cannot be undone.</p>
      <div className={formStyles.buttonGroup}>
        <button type="button" onClick={onClose} className={formStyles.cancelButton}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className={formStyles.deleteButton}>
          Delete
        </button>
      </div>
    </Modal>
  )
}
