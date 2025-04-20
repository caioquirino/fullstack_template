export type JargonTerm = {
  id: string
  term: string
  description: string
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  lastActive: string
}

export type Column<T> = {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  hiddenOnMobile?: boolean
}

export type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  actions?: {
    label: string
    onClick: (item: T) => void
    className?: string
  }[]
}
