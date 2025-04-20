import { DataTableProps } from './types'

export function DataTable<T>({ data, columns, actions }: DataTableProps<T>) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th key={column.key.toString()} className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.hiddenOnMobile ? 'hidden sm:table-cell' : ''}`}>
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item) => (
              <tr key={(item as any).id}>
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
                    className={`px-4 sm:px-6 py-4 text-sm ${column.hiddenOnMobile ? 'hidden sm:table-cell' : ''} ${column.wrap ? 'whitespace-normal break-words max-w-md' : 'whitespace-nowrap'} ${
                      typeof column.key === 'string' && column.key === 'term' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-2">
                      {actions.map((action, index) => (
                        <button key={index} onClick={() => action.onClick(item)} className={action.className}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
