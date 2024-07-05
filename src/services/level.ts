import type { Level } from "@/domain/Level"
import { ErrorMessage } from "./messages"

export const levelFormIsCorrectlyFilled = (level: Level) => {
    if (!level.name || !level.link) {
      ErrorMessage('You need to fill all the fields')
      return false
    }
    if (level.maxCoefficient === 0 || level.maxCoefficient > 100) {
      ErrorMessage('MaxRange should be greater than 0 and smaller than 100')
      return false
    }
    if (level.maxCoefficient <= level.minCoefficient) {
      ErrorMessage('MaxRange should be greater than MinRange')
      return false
    }
    return true
  }