<template>
  <div class="Container">
    <img src="@/assets/images/logo-and-lettering.svg" alt="Saci Logo" />
    <h1>{{ getDialogTitle }}</h1>
    <h2>Basic Information</h2>
    <div class="NameContainer">
      <h5>Name</h5>
      <ElInput placeholder="Level Name" v-model="localLevel.name" />
    </div>
    <div class="LinkAndCoeficientsContainer">
      <div class="CoeficientsContainer">
        <h5>Coefficient Range</h5>
        <span>
          <ElInputNumber v-model="localLevel.minCoefficient" :min="0" :max="100" />
          <h4>to</h4>
          <ElInputNumber
            v-model="localLevel.maxCoefficient"
            :min="localLevel.minCoefficient"
            :max="100"
          />
        </span>
      </div>
      <div class="LinkField">
        <h5>Link to Knowledge Path</h5>
        <ElInput placeholder="Link" v-model="localLevel.link"></ElInput>
      </div>
    </div>
    <div class="SaveButton">
      <ElButton type="primary" @click="saveForm()"> {{ dialogButtonLabel }} </ElButton>
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
import { useRouter } from 'vue-router'
import { HttpServerError } from '@/services/http'
import { useLevelStore } from '@/stores/levels'

const roleStore = useRolesStore()
const levelsStore = useLevelStore()
const router = useRouter()
const level = ref<Level>({} as Level)
const role = ref<Role>()
const isEditMode = ref(false)
const roleId = ref()
const localLevel = ref<Level>({ name: '', minCoefficient: 0, maxCoefficient: 0, link: '' })
const dialogButtonLabel = computed(() => (isEditMode.value ? 'Save' : 'Create'))
const getDialogTitle = computed(() => {
  const roleName = role.value?.name || ''
  const levelName = localLevel.value.name || 'New Level'
  return isEditMode.value ? `${roleName} - Edit Level` : `${roleName} - ${levelName}`
})

onMounted(async () => {
  const levelId = router.currentRoute.value.params.levelId?.toString()
  if (levelId) {
    level.value = await levelsStore.getLevelById(levelId)
    role.value = await roleStore.loadRoleById(level.value.roleId!)
    localLevel.value = { ...level.value }
    isEditMode.value = true
  } else {
    roleId.value = router.currentRoute.value.query.roleId
    role.value = await roleStore.loadRoleById(roleId.value)
    isEditMode.value = false
    localLevel.value = { name: '', minCoefficient: 0, maxCoefficient: 0, link: '' }
  }
})

const saveForm = async () => {
  if (isAllGapsCorrectlyFilled()) {
    try {
      if (isEditMode.value) {
        level!.value.name = localLevel.value.name
        level!.value.minCoefficient = localLevel.value.minCoefficient
        level!.value.maxCoefficient = localLevel.value.maxCoefficient
        level!.value.link = localLevel.value.link
        await levelsStore.editLevel(level!.value, role.value)
        SuccessMessage('Level updated successfully')
      } else {
        await levelsStore.addLevel(localLevel.value, role.value!)
        localLevel.value = { name: '', minCoefficient: 0, maxCoefficient: 0, link: '' }
        SuccessMessage('Level created successfully')
      }
      redirectToRoleView()
    } catch (error: any) {
      if (error.status === HttpServerError.HTTP_STATUS_CODE_CONFLICT) {
        ErrorMessage('This level name already exists')
      } else if (error.status === HttpServerError.HTTP_SERVER_ERROR) {
        ErrorMessage('Maximum and Minimum range overlap')
      } else {
        ErrorMessage('Unexpected error')
      }
    }
  }
}

const isAllGapsCorrectlyFilled = () => {
  if (!localLevel.value.name || !localLevel.value.link) {
    ErrorMessage('You need to fill all the fields')
    return false
  }
  if (localLevel.value.maxCoefficient === 0 || localLevel.value.maxCoefficient > 100) {
    ErrorMessage('MaxRange should be greater than 0 and smaller than 100')
    return false
  }
  if (localLevel.value.maxCoefficient <= localLevel.value.minCoefficient) {
    ErrorMessage('MaxRange should be greater than MinRange')
    return false
  }
  return true
}

const redirectToRoleView = () => {
  router.push({ name: 'RoleView', params: { roleId: role.value?.id } })
}
</script>

<style scoped lang="scss">
.Container {
  padding-top: 20px;
  width: 800px;
  height: auto;
  margin: auto;
  text-align: center;
  h5 {
    text-align: left;
    padding-bottom: 5px;
  }
  h1 {
    text-align: left;
    padding-bottom: 30px;
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
    .el-input {
      width: 800px;
      height: 56px;
    }
  }
  .LinkAndCoeficientsContainer {
    display: flex;
    justify-content: space-between;
  }

  .CoeficientsContainer {
    span {
      display: flex;
      align-items: center;
    }
    .el-input-number {
      width: 140px;
      height: 56px;
    }
    h4 {
      margin: 0 10px;
    }
  }

  .LinkField {
    text-align: left;
    .el-input {
      width: 417px;
      height: 56px;
    }
  }
}
</style>
