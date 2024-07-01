import type { Level } from '@/domain/Level'
import { type Ref, ref } from 'vue'

const levels: Ref<Level[]> = ref([])

export { levels }
