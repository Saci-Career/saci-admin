<template>
  <div class="PageWrapper">
    <div class="TableContainer">
      <div class="ImageContainer">
        <img src="@/assets/images/logo-and-lettering.svg" alt="Saci Logo" />
      </div>
      <h1>{{ role?.name }}</h1>
      <LevelsTable :levels="role?.levels!" />
      <KnowledgesTable :knowledges="role?.knowledges!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import KnowledgesTable from '@/components/KnowledgesTable.vue'
import LevelsTable from '@/components/LevelsTable.vue'
import { useRolesStore } from '@/stores/roles/index'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Role } from '@/domain/Role'
import { ErrorMessage } from '@/services/messages'

const role = ref<Role>()
const router = useRouter()
const roleStore = useRolesStore()

onMounted(async () => {
  const roleId = router.currentRoute.value.params.roleId as string
  try {
    role.value = await roleStore.loadRoleById(parseInt(roleId))
  } catch (error) {
    ErrorMessage('Error Loading Role')
  }
})
</script>

<style scoped lang="scss">
.PageWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  h1 {
    padding-bottom: 40px;
  }
}

.TableContainer {
  width: 800px;
  height: auto;
  margin: auto;
  .ImageContainer {
    margin-top: 50px;

    img {
      padding-top: 20px;
      width: 100px;
    }
    text-align: center;
  }
  text-align: left;
}
</style>
