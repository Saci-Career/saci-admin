import { ElMessage } from 'element-plus'

export const ErrorMessage = (message: string) => {
  ElMessage({
    message: message,
    type: 'error'
  })
}

export const SuccessMessage = (message: string) => {
  ElMessage({
    message: message,
    type: 'success'
  })
}
