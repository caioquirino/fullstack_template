export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  buttonRef?: React.RefObject<HTMLButtonElement>
}
