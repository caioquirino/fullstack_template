export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  hiddenOnMobile?: boolean
  wrap?: boolean
}

export interface DataTableProps<T> {
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
