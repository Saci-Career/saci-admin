<template>
  <h2>Knowledges</h2>
  <ElTable :data="knowledges" style="width: 100%">
    <ElTableColumn prop="name" label="Knowledges" />
    <ElTableColumn prop="weight" label="Weight" width="450" />
    <ElTableColumn fixed="right" label="Actions" width="150">
      <template #default="{ row }">
        <div>
          <ElButton @click="onClickDelete(row)" link size="small">Delete</ElButton>
          <ElButton @click="openEditDialog(row)" link size="small">Edit</ElButton>
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
  <br />
  <div class="NewKnowledge">
    <ElButton type="primary" @click="openCreateDialog">Create Knowledge</ElButton>
  </div>
  <KnowledgeInformationDialog
    v-model:visible="isDialogVisible"
    :knowledge="selectedKnowledge"
    :roleId="parseInt(roleId)"
  />
  <RemoveKnowledgeDialog
    v-model:visible="deleteKnowledgeDialogVisible"
    :knowledgeId="knowledgeToDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import type { Knowledge } from '@/domain/Knowledge'
import { useRolesStore } from '@/stores/roles/index'
import type { Role } from '@/domain/Role'
import { useRouter } from 'vue-router'
import RemoveKnowledgeDialog from '@/components/RemoveKnowledgeDialog.vue'
import KnowledgeInformationDialog from '@/components/KnowledgeInformationDialog.vue'

const roleStore = useRolesStore()
const role = ref<Role>()
const router = useRouter()
const roleId = ref('')

const isDialogVisible = ref(false)
const selectedKnowledge = ref<Knowledge | undefined>()

defineProps<{
  knowledges?: Knowledge[]
}>()

onMounted(async () => {
  roleId.value = router.currentRoute.value.params.roleId as string
  role.value = await roleStore.loadRoleById(parseInt(roleId.value))
})

const openCreateDialog = () => {
  selectedKnowledge.value = undefined
  isDialogVisible.value = true
}

const openEditDialog = (row: Knowledge) => {
  selectedKnowledge.value = row
  isDialogVisible.value = true
}

const deleteKnowledgeDialogVisible = ref(false)
const knowledgeToDelete = ref(0)

const onClickDelete = (row: Knowledge) => {
  knowledgeToDelete.value = Number(row.id)
  deleteKnowledgeDialogVisible.value = true
}
</script>

<style scoped lang="scss">
.KnowledgeWeight {
  text-align: justify left;
}

.Slider .KnowledgeWeight {
  font-size: 14px;
  text-align: right;
  color: var(--el-text-color-secondary);
  line-height: 60px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.NewKnowledge {
  text-align: right;
}
</style>
