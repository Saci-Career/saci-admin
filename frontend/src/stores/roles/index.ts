import { defineStore } from 'pinia'

import { getRoles } from './getters'
import { fetchRoles, addRole } from './actions'

import { roles } from './state'

export const useRolesStore = defineStore('roles', () => {
  return {
    roles,
    getRoles,
    fetchRoles,
    addRole
  }
})