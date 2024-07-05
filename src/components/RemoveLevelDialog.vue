<template>
  <ElDialog :model-value="visible" title="Warning" width="500" @close="closeDeleteDialog">
    <span>Level will be permanently removed. Continue?</span>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDeleteDialog">Cancel</ElButton>
        <ElButton type="primary" @click="deleteLevel">Confirm</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElButton, ElDialog } from 'element-plus'
import { SuccessMessage, ErrorMessage } from '@/services/messages'
import { useLevelStore } from '@/stores/levels'

const levelsStore = useLevelStore()
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  levelToDelete: {
    type: Number,
    required: true
  }
})
const emits = defineEmits(['update:visible', 'confirm-delete'])

const closeDeleteDialog = () => {
  emits('update:visible', false)
}

async function deleteLevel() {
  try {
    await levelsStore.removeLevel(props.levelToDelete)
    SuccessMessage('Level removed!')
    closeDeleteDialog()
  } catch (error) {
    ErrorMessage('Failed to delete level')
  }
}
</script>
