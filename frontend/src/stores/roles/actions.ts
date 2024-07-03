import { get, post, put, deleteRequest } from '@/services/http'
import type { Role } from '@/domain/Role'
import { roles } from './state'

function setRoles(newRoles: Role[]): void {
  roles.value = newRoles
}

async function fetchRoles(): Promise<void> {
  if (roles.value.length > 0) {
    return
  }

  const fetchedRoles = await get<Role[]>('/roles')
  setRoles(fetchedRoles)
}

async function addRole(role: Role): Promise<void> {
  const response = await post<Role>('/roles', role)
  roles.value.push(response)
}

async function editRoleAction(role: Role): Promise<void> {
  const updatedRole = await put<Role>(`/roles/${role.id}`, role)
  roles.value = roles.value.map((item) => (item.id === role.id ? updatedRole : item))
}

async function removeRole(roleId: number): Promise<void> {
  await deleteRequest(`/roles/${roleId}`)
  roles.value = roles.value.filter((role) => role.id !== roleId)
}

async function loadRoleById(roleId: number): Promise<Role | undefined> {
  const role = await get<Role>(`/roles/${roleId}`)
  const index = roles.value.findIndex((r) => r.id === roleId)
  if (index === -1) {
    roles.value.push(role)
    return role
  } else {
    roles.value[index] = role
    return roles.value[index]
  }
}

export { fetchRoles, addRole, editRoleAction, removeRole, loadRoleById }
