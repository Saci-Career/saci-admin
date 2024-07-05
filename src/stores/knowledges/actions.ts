import { get, post, put, deleteRequest } from '@/services/http'
import type { Knowledge } from '@/domain/Knowledge'
import { roles } from '../roles/state'
import { loadRoleById } from '../roles/actions'

async function removeKnowledge(knowledgeId: number): Promise<void> {
  await deleteRequest(`/knowledges/${knowledgeId}`)

  roles.value = roles.value.map((role) => {
    if (role.knowledges) {
      role.knowledges = role.knowledges.filter((knowledge) => knowledge.id !== knowledgeId)
    }
    return role
  })
}

async function saveKnowledge(knowledge: Knowledge): Promise<void> {
  const response = await post<Knowledge>('/knowledges', knowledge)
  roles.value = roles.value.map((role) => {
    if (role.id !== knowledge.roleId) {
      return role
    }
    role.knowledges?.push(response)
    return role
  })
}

async function editKnowledge(knowledge: Knowledge): Promise<void> {
  await put<Knowledge>(`/knowledges/${knowledge.id}`, knowledge)
}

export { saveKnowledge, editKnowledge, removeKnowledge }
