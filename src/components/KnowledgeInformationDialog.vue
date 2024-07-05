<template>
  <ElDialog :model-value="props.visible" :title="dialogTitle" width="500" @close="hideDialog">
    <ElInput v-model="localKnowledge.name" placeholder="Enter Name" autocomplete="on" />
    <div class="Slider">
      <span class="KnowledgeWeight"> Weight </span>
      <ElSlider v-model="localKnowledge.weight" :max="5" :step="1" show-stops />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="cancelEdit">Cancel</ElButton>
        <ElButton type="primary" @click="saveForm">{{ dialogButtonLabel }}</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue'
import { ElButton, ElDialog, ElInput, ElSlider } from 'element-plus'
import { useKnowledgeStore } from '@/stores/knowledges'
import { HttpServerError } from '@/services/http'
import { SuccessMessage, ErrorMessage } from '@/services/messages'
import type { Knowledge } from '@/domain/Knowledge'

const knowledgeStore = useKnowledgeStore()
const originalKnowledgeWeight = ref('')
const originalKnowledgeName = ref('')
const props = defineProps<{
  visible: boolean
  knowledge: Knowledge | undefined
  roleId: number
}>()
const emits = defineEmits(['update:visible', 'confirm-edit', 'confirm-create'])

const localKnowledge = ref<Knowledge>({ name: '', weight: 0, roleId: props.roleId })
const isEditMode = ref(false)

const dialogTitle = computed(() => (isEditMode.value ? 'Edit Knowledge' : 'Create Knowledge'))
const dialogButtonLabel = computed(() => (isEditMode.value ? 'Save' : 'Create'))

const hideDialog = () => {
  emits('update:visible', false)
}

const cancelEdit = () => {
  if (isEditMode.value) {
    localKnowledge.value.name = originalKnowledgeName.value
    localKnowledge.value.weight = parseInt(originalKnowledgeWeight.value)
  } else {
    localKnowledge.value = { name: '', weight: 0, roleId: props.roleId }
  }
  hideDialog()
}

const saveForm = async () => {
  try {
    if (isEditMode.value) {
      props.knowledge!.name = localKnowledge.value.name
      props.knowledge!.weight = localKnowledge.value.weight
      await knowledgeStore.editKnowledge(props.knowledge!)
      SuccessMessage('Knowledge updated successfully')
      emits('confirm-edit')
    } else {
      await knowledgeStore.saveKnowledge(localKnowledge.value)
      localKnowledge.value = { name: '', weight: 0, roleId: props.roleId }
      SuccessMessage('Knowledge created successfully')
      emits('confirm-create')
    }
    hideDialog()
  } catch (error: any) {
    if (error.status === HttpServerError.HTTP_STATUS_CODE_CONFLICT) {
      ErrorMessage('This name already exists')
    } else {
      ErrorMessage('Unexpected error updating the knowledge')
    }
  }
}

onUpdated(async () => {
  localKnowledge.value = props.knowledge
    ? props.knowledge
    : { name: '', weight: 0, roleId: props.roleId || 0 }
  isEditMode.value = !!props.knowledge
  originalKnowledgeName.value = localKnowledge.value.name
  originalKnowledgeWeight.value = String(localKnowledge.value.weight)
})
</script>

<style scoped lang="scss">
.el-slider {
  flex: 1;
  padding-left: 15px;
}

.KnowledgeWeight {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-right: 15px;
  white-space: nowrap;
}

.Slider {
  display: flex;
  font-size: 14px;
  align-items: center;
  margin-bottom: 0;
  margin-top: 20px;
}
</style>
