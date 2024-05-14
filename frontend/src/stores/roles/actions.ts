import { get, post, put } from '@/services/http'
import { getRoles } from './getters'
import { roles } from './state'
import type { Role } from '@/domain/Role'
import { deleteRequest } from '@/services/http'

async function fetchRoles(): Promise<void> {
  if (getRoles?.value?.length > 0) {
    return
  }

  const roles = await get<Role[]>('/roles')

  setRoles(roles)
}

async function addRole(role: Role) {
  roles.value.push(role)
  await post<Role[]>('/roles', role)
}

function setRoles(newRoles: Role[]): void {
  roles.value = newRoles
}

async function editRoleAction(role: Role): Promise<void> {
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
export { fetchRoles, addRole, editRoleAction, removeRole }
