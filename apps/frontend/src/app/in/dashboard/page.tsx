'use client'

import { useState, useRef } from 'react'
import { JargonList } from '@/components/dashboard/JargonList'
import { JargonModal } from '@/components/dashboard/JargonModal'
import { DeleteModal } from '@/components/dashboard/DeleteModal'
import { JargonTerm } from '@/components/dashboard/types'
import { useQuery, useMutation } from 'urql'
import { graphql } from '../../../gql'
import { Jargon } from '../../../gql/graphql'

const GetJargonsQuery = graphql(/* GraphQL */ `
  query GetJargons {
    jargons {
      id
      term
      description
    }
  }
`)

const CreateJargonMutation = graphql(/* GraphQL */ `
  mutation CreateJargon($term: String!, $description: String!) {
    createJargon(term: $term, description: $description) {
      id
      term
      description
    }
  }
`)

const UpdateJargonMutation = graphql(/* GraphQL */ `
  mutation UpdateJargon($id: String!, $term: String!, $description: String!) {
    updateJargon(id: $id, term: $term, description: $description) {
      id
      term
      description
    }
  }
`)

const DeleteJargonMutation = graphql(/* GraphQL */ `
  mutation DeleteJargon($id: String!) {
    deleteJargon(id: $id)
  }
`)

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<JargonTerm | null>(null)
  const [newTerm, setNewTerm] = useState<Partial<JargonTerm>>({
    term: '',
    description: '',
  })
  const addTermInputRef = useRef<HTMLInputElement>(null)
  const editTermInputRef = useRef<HTMLInputElement>(null)

  // Query for fetching jargons
  const [result, reexecuteQuery] = useQuery({
    query: GetJargonsQuery,
  })
  const { data, fetching, error } = result || {}

  // Mutations
  const [, createJargon] = useMutation(CreateJargonMutation)
  const [, updateJargon] = useMutation(UpdateJargonMutation)
  const [, deleteJargon] = useMutation(DeleteJargonMutation)

  // Transform GraphQL data to JargonTerm format
  const terms: JargonTerm[] =
    data?.jargons?.map((jargon: Jargon) => ({
      id: jargon.id,
      term: jargon.term,
      description: jargon.description,
    })) || []

  const handleAddTerm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTerm.term || !newTerm.description) return

    const result = await createJargon({
      term: newTerm.term,
      description: newTerm.description,
    })

    if (result.data) {
      setIsAddModalOpen(false)
      setNewTerm({ term: '', description: '' })
    }
  }

  const handleEditTerm = (term: JargonTerm) => {
    setSelectedTerm(term)
    setNewTerm({
      term: term.term,
      description: term.description,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateTerm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTerm || !newTerm.term || !newTerm.description) return

    const result = await updateJargon({
      id: selectedTerm.id,
      term: newTerm.term,
      description: newTerm.description,
    })

    if (result.data) {
      setIsEditModalOpen(false)
      setSelectedTerm(null)
      setNewTerm({ term: '', description: '' })
    }
  }

  const handleDeleteClick = (term: JargonTerm) => {
    setSelectedTerm(term)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTerm) return

    const result = await deleteJargon({
      id: selectedTerm.id,
    })

    if (result.data) {
      setIsDeleteModalOpen(false)
      setSelectedTerm(null)
      // Refetch the data after successful deletion
      reexecuteQuery({ requestPolicy: 'network-only' })
    }
  }

  const handleCancelAdd = () => {
    setIsAddModalOpen(false)
    setNewTerm({ term: '', description: '' })
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setSelectedTerm(null)
    setNewTerm({ term: '', description: '' })
  }

  if (fetching) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jargon Management Dashboard</h1>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Add New Term
          </button>
        </div>

        <JargonList terms={terms} onEdit={handleEditTerm} onDelete={handleDeleteClick} />

        <JargonModal
          isOpen={isAddModalOpen}
          onClose={handleCancelAdd}
          onSubmit={handleAddTerm}
          title="Add New Term"
          term={newTerm}
          onChange={(field, value) => setNewTerm({ ...newTerm, [field]: value })}
          inputRef={addTermInputRef as React.RefObject<HTMLInputElement>}
        />

        <JargonModal
          isOpen={isEditModalOpen}
          onClose={handleCancelEdit}
          onSubmit={handleUpdateTerm}
          title="Edit Term"
          term={newTerm}
          onChange={(field, value) => setNewTerm({ ...newTerm, [field]: value })}
          inputRef={editTermInputRef as React.RefObject<HTMLInputElement>}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setSelectedTerm(null)
          }}
          onConfirm={handleDeleteConfirm}
          title={'Delete Term'}
          itemName={selectedTerm?.term || ''}
        />
      </div>
    </div>
  )
}
