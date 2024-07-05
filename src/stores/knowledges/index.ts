import { defineStore } from 'pinia'
import { removeKnowledge, saveKnowledge, editKnowledge } from './actions'

export const useKnowledgeStore = defineStore('knowledges', () => {
  return {
    removeKnowledge,
    saveKnowledge,
    editKnowledge
  }
})
