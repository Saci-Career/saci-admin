<template>
  <div class="Container">
    <img src="@/assets/images/logo-and-lettering.svg" alt="Saci Logo" />

    <div class="Form">
      <h1>{{ getDialogTitle }}</h1>
      <h2>Basic Information</h2>
      <div class="NameContainer">
        <h5>Name</h5>
        <ElInput placeholder="Level Name" v-model="localLevel.name" size="large" />
      </div>
      <div class="LinkAndCoeficientsContainer">
        <div class="Coeficients">
          <h5>Coefficient Range</h5>
          <span class="Coeficients__container">
            <ElInputNumber v-model="localLevel.minCoefficient" :min="0" :max="100" size="large" />
            <h4>to</h4>
            <ElInputNumber
              v-model="localLevel.maxCoefficient"
              :min="localLevel.minCoefficient"
              :max="100"
              size="large"
            />
          </span>
        </div>
        <div class="LinkField">
          <h5>Link to Knowledge Path</h5>
          <ElInput placeholder="Link" v-model="localLevel.link" size="large"></ElInput>
        </div>
      </div>
      <div class="SaveButton">
        <ElButton type="primary" @click="saveForm()"> {{ levelId ? 'Save' : 'Create' }} </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '@/domain/Role'
import type { Level } from '@/domain/Level'
import { useRolesStore } from '@/stores/roles'
import { ref, onMounted, computed } from 'vue'
import { ElInput, ElButton, ElInputNumber } from 'element-plus'
import { ErrorMessage, SuccessMessage } from '@/services/messages'
import { HttpServerError } from '@/services/http'
import { levelFormIsCorrectlyFilled } from '@/services/level'
import { useRouter } from 'vue-router'
import { useLevelStore } from '@/stores/levels'

const roleStore = useRolesStore()
const levelsStore = useLevelStore()
const router = useRouter()
const level = ref<Level>({} as Level)
const role = ref<Role>()
const levelId = computed(() => router.currentRoute.value.params.levelId?.toString())
const localLevel = ref<Level>({ name: '', minCoefficient: 0, maxCoefficient: 0, link: '' })

const getDialogTitle = computed(() => {
  const roleName = role.value?.name || ''
  const levelName = localLevel.value.name || 'New Level'
  return levelId.value ? `${roleName} - Edit Level` : `${roleName} - ${levelName}`
})

onMounted(async () => {
  const roleId = router.currentRoute.value.query.roleId as string
  role.value = await roleStore.loadRoleById(parseInt(roleId))

  if (levelId.value) {
    level.value = await levelsStore.getLevelById(levelId.value)
    localLevel.value = { ...level.value }
  }
})

const saveForm = async () => {
  if (!levelFormIsCorrectlyFilled(localLevel.value)) {
    return
  }

  try {
    level.value = localLevel.value

    await levelsStore.saveLevel(level!.value, role.value!)

    SuccessMessage('Level saved successfully')
    redirectToRoleView()
  } catch (error: any) {
    if (error.status === HttpServerError.HTTP_STATUS_CODE_CONFLICT) {
      ErrorMessage('This level name already exists')
    } else if (error.status === HttpServerError.HTTP_STATUS_BAD_REQUEST) {
      ErrorMessage('Maximum and Minimum range overlap')
    } else {
      ErrorMessage('Unexpected error')
    }
  }
}

const redirectToRoleView = () => {
  router.push({ name: 'RoleView', params: { roleId: role.value?.id } })
}
</script>

<style scoped lang="scss">
.Container {
  padding-top: 20px;
  width: 800px;
  margin: auto;
  padding-top: 5rem;
  text-align: center;

  .Form {
    text-align: left;
  }

  img {
    width: 100px;
  }

  .SaveButton {
    text-align: right;
    margin-top: 50px;

    button {
      width: 215px;
      height: 32px;
    }
  }

  .NameContainer {
    padding-bottom: 20px;
  }

  .LinkAndCoeficientsContainer {
    display: flex;
    justify-content: space-between;
  }

  .Coeficients {
    &__container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .LinkField {
    text-align: left;
    width: 20rem;
  }
}
</style>
