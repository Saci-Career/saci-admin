import { computed } from 'vue'
import { roles } from '@/stores/roles/state'

const getRoles = computed(() => {
  return roles?.value
})

export { getRoles }
