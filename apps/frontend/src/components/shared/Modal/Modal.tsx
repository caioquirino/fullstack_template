import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  buttonRef?: React.RefObject<HTMLButtonElement>
}

export function Modal({ isOpen, onClose, title, children, buttonRef }: ModalProps) {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey)
      return () => window.removeEventListener('keydown', handleEscKey)
    }
    return
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      buttonRef.current.focus()
    }
  }, [isOpen, buttonRef])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}
