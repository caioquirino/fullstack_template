import { JargonTerm } from './types'
import { DataTable, Column } from '@/components/shared/DataTable'

interface JargonListProps {
  terms: JargonTerm[]
  onEdit: (term: JargonTerm) => void
  onDelete: (term: JargonTerm) => void
}

export function JargonList({ terms, onEdit, onDelete }: JargonListProps) {
  const columns: Column<JargonTerm>[] = [
    {
      key: 'term',
      header: 'Term',
    },
    {
      key: 'description',
      header: 'Description',
      hiddenOnMobile: true,
      wrap: true,
    },
  ]

  const actions = [
    {
      label: 'Edit',
      onClick: onEdit,
      className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
    },
    {
      label: 'Delete',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
    },
  ]

  return <DataTable data={terms} columns={columns} actions={actions} />
}
