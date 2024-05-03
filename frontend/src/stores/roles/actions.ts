import { get, post, put, deleteRequest } from '@/services/http'
import { getRoles } from './getters'
import { setRoles, roles } from './state'
import type { Role } from '@/domain/Role'

async function fetchRoles(): Promise<void> {
  if (getRoles?.value?.length > 0) {
    return
  }

  const fetchedRoles = await get<Role[]>('/roles')

  setRoles(fetchedRoles)
}

async function addRole(role: Role): Promise<void> {
  await post<Role[]>('/roles', role)
  const updatedRoles = [...roles.value, role]
  setRoles(updatedRoles)
}

async function editRole(role: Role): Promise<void> {
  await put<Role[]>(`/roles/${role.id}`, role)
  roles.value = roles.value.map((item) => {
    if (item.id === role.id) {
      return role
    }
    return item
  })
}

async function removeRole(roleId: string) {
  await deleteRequest(`/roles/${roleId}`)
  roles.value = roles.value.filter((role) => role.id !== parseInt(roleId))
}

export { fetchRoles, addRole, editRole, removeRole }

function setRoles(newRoles: Role[]): void {
  roles.value = newRoles
}

export const saveKnowledge = async (newKnowledge: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/knowledges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newKnowledge })
    })
    if (!response.ok) {
      throw new Error('Failed to save knowledge')
    }

    return true
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}
