import { defineStore } from 'pinia'
import { removeLevel, addLevel, editLevel } from './actions'
import { getLevelsByRoleId, getLevelById } from './getters'

export const useLevelStore = defineStore('levels', () => {
  return {
    getLevelsByRoleId,
    removeLevel,
    addLevel,
    editLevel,
    getLevelById
  }
})
