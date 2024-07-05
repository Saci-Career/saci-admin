<template>
  <ElDialog :model-value="visible" title="Warning" width="500" @close="closeDeleteKnowledgeDialog">
    <span>Knowledge will be permanently removed. Continue?</span>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDeleteKnowledgeDialog">Cancel</ElButton>
        <ElButton type="primary" @click="deleteKnowledge()"> Confirm </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElButton, ElDialog } from 'element-plus'
import { useKnowledgeStore } from '@/stores/knowledges'
import { SuccessMessage, ErrorMessage } from '@/services/messages'

const knowledgeStore = useKnowledgeStore()
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  knowledgeId: {
    type: Number,
    required: true
  }
})
const emits = defineEmits(['update:visible', 'confirm-delete'])

const closeDeleteKnowledgeDialog = () => {
  emits('update:visible', false)
}
async function deleteKnowledge() {
  try {
    await knowledgeStore.removeKnowledge(props.knowledgeId)
    SuccessMessage('Knowledge removed!')
    closeDeleteKnowledgeDialog()
  } catch (error) {
    ErrorMessage('Failed to delete knowledge')
  }
}
</script>
