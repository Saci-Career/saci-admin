<template>
  <h2>Levels</h2>
  <ElTable :data="levels" class="FullWidthTable">
    <ElTableColumn prop="name" label="Levels" />
    <ElTableColumn prop="minCoefficient" label="Minimum Coefficient" />
    <ElTableColumn prop="maxCoefficient" label="Maximum Coefficient" />
    <ElTableColumn fixed="right" label="Actions" width="150">
      <template #default="{ row }">
        <div>
          <ElButton @click="openDeleteLevelButton(row)" type="text" size="small">Delete</ElButton>

          <ElButton @click="onEditRow(row)" type="text" size="small">Edit</ElButton>
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
  <div class="NewLevel">
    <ElButton type="primary" @click="redirectToLevelView()"> Create Level </ElButton>
  </div>
  <RemoveLevelDialog v-model:visible="deleteDialogVisible" :levelToDelete="levelToDelete" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import type { Knowledge } from '@/domain/Knowledge'
import type { Role } from '@/domain/Role'
import type { Level } from '@/domain/Level'
import RemoveLevelDialog from '@/components/RemoveLevelDialog.vue'
import { useRouter } from 'vue-router'

defineProps<{
  levels: Level[]
}>()

const router = useRouter()
const role = ref<Role>()

const redirectToLevelView = () => {
  router.push({ name: 'LevelView', params: { id: role.value?.id } })
}

const onEditRow = (row: Knowledge) => {
  console.log('Edit clicked for:', row)
}

const deleteDialogVisible = ref(false)
const levelToDelete = ref(0)

const openDeleteLevelButton = (row: Level) => {
  levelToDelete.value = Number(row.id)
  deleteDialogVisible.value = true
}
</script>

<style scoped lang="scss">
.NewLevel {
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: right;
}
</style>
