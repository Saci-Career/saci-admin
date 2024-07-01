import { deleteRequest, get, post, put } from '@/services/http'
import { roles } from '../roles/state'
import type { Level } from '@/domain/Level'
import type { Role } from '@/domain/Role'
import { get, post, put } from '@/services/http'
import { levels } from './state'

async function removeLevel(levelId: number) {
  await deleteRequest(`/levels/${levelId}`)
}

async function addLevel(level: Level, role: Role): Promise<void> {
  const levelWithRoleId = { ...level, roleId: role.id }
  await post<Level[]>('/levels', levelWithRoleId)
  role.levels?.push(level)
}

async function editLevel(level: Level): Promise<void> {
  await put<Level[]>(`/levels/${level.id}`, level)
  levels.value = levels.value.map((item) => {
    if (item.id === level.id) {
      return level
    }
    return item
  })
}

export { editLevel, removeLevel, addLevel, getLevelsByRoleId }
