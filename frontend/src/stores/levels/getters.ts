import type { Level } from '@/domain/Level'
import { get } from '@/services/http'
import { loadRoleById } from '../roles/actions'

async function getLevelsByRoleId(roleId: number): Promise<Level[] | undefined> {
  const role = await loadRoleById(roleId)

  if (!role) {
    throw "Role doesn't exist with " + roleId
  }

  if (role && !role.levels) {
    const sortedLevels = await get<Level[]>(`/levels/sorted/${roleId}`)
    role.levels = sortedLevels
  }

  return role?.levels
}

async function getLevelById(levelId: string) {
  return await get<Level>(`/levels/${levelId}`)
}
export { getLevelsByRoleId, getLevelById }
