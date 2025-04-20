import { TeamMember } from './types'
import { DataTable, Column } from '@/components/shared/DataTable'

interface TeamListProps {
  members: TeamMember[]
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
}

export function TeamList({ members, onEdit, onDelete }: TeamListProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Edit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Read':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'email',
      header: 'Email',
      hiddenOnMobile: true,
    },
    {
      key: 'role',
      header: 'Role',
      render: (member) => <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(member.role)}`}>{member.role}</span>,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      hiddenOnMobile: true,
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

  return <DataTable data={members} columns={columns} actions={actions} />
}
