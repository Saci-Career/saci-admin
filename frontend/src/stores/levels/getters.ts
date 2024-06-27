import type { Level } from '@/domain/Level'
import { get } from '@/services/http'
import { getRoleById } from '../knowledges/getters'
import { computed } from 'vue'
import { levels } from './state'



async function getLevelsByRoleId(roleId: number): Promise<Level[] | undefined> {
  const role = getRoleById(roleId)

  if(!role) {
    throw "Role doesn't exist with " + roleId
  }

  if (role && !role.levels) {
    const sortedLevels = await get<Level[]>(`/levels/sorted/${roleId}`)
    role.levels = sortedLevels
  }

  return role?.levels
}

const getLevels = computed(() => {
  return levels?.value
})

async function getLevelById(levelId: string) {
  return await get<Level>(`/levels/${levelId}`)
}
export { getLevels, getLevelById, getLevelsByRoleId }
