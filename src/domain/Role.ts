import type { Knowledge } from './Knowledge'
import type { Level } from './Level'

export interface Role {
  id?: number
  name: string
  knowledges?: Array<Knowledge>
  levels?: Array<Level>
}
