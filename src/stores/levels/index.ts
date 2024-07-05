import { defineStore } from 'pinia'
import { removeLevel, saveLevel } from './actions'
import { getLevelsByRoleId, getLevelById } from './getters'

export const useLevelStore = defineStore('levels', () => {
  return {
    getLevelsByRoleId,
    removeLevel,
    saveLevel,
    getLevelById
  }
})
