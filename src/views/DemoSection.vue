<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import Divider from '@/components/Divider.vue'
import { useRolesStore } from '@/stores/roles/index'

const rolesStore = useRolesStore()
const newRoleName = ref('')

onMounted(async () => {
  await rolesStore.fetchRoles()
})

const onSaveRole = async () => {
  await rolesStore.addRole({ name: newRoleName.value })

  ElMessage({
    message: 'Congrats, your role is now added',
    type: 'success'
  })

  newRoleName.value = ''
}
</script>

<template>
  <div class="demo">
    <h2>Already created roles</h2>

    <ul>
      <li v-for="role in rolesStore.getRoles" :key="role.id">{{ role.name }}</li>
    </ul>

    <Divider />

    <h4>Through this field you can send to the backend a new role, just to test</h4>

    <ElInput v-model="newRoleName" size="large" placeholder="Set the role you want" />

    <ElButton @click="onSaveRole">Save role</ElButton>
  </div>
</template>

<style scoped lang="scss">
.demo {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  .el-input,
  h4 {
    text-align: center;
    width: 70%;
  }
}
</style>
