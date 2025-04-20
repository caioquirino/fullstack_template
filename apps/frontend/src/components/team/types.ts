export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Edit' | 'Read'
  lastActive: string
}
