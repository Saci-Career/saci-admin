import type { Role } from '@/domain/Role'
import { type Ref, ref } from 'vue'

const roles: Ref<Role[]> = ref([])

export { roles }
