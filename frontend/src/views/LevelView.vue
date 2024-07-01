<template>
  <div class="Container">
    <img src="@/assets/images/logo-and-lettering.svg" alt="Saci Logo" />
    <h1>{{ newLevelTitle }}</h1>
    <h2>Basic Information</h2>
    <div class="NameContainer">
      <h5>Name</h5>
      <ElInput placeholder="Level Name" v-model="localLevel.name" />
    </div>
    <div class="LinkAndCoeficientsContainer">
      <div class="CoeficientsContainer">
        <h5>Coeficient Range</h5>
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
      <ElButton type="primary" @click="saveForm()"> Save </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@/domain/Level'
import { useRolesStore } from '@/stores/roles'
import { ref, onMounted, computed } from 'vue'
import { ElInput, ElButton, ElInputNumber } from 'element-plus'
import { ErrorMessage, SuccessMessage } from '@/services/messages'
import { useRouter } from 'vue-router'
import { HttpServerError } from '@/services/http'
import { useLevelStore } from '@/stores/levels'
import { editLevel } from '@/stores/levels/actions'
import type { Role } from '@/domain/Role'

const roleStore = useRolesStore()
const newLevel = ref<Level>({
  name: '',
  minCoefficient: 0,
  maxCoefficient: 0,
  link: ''
})

const level = ref<Level>({} as Level)

const dialogTitle = computed(() => (isEditMode.value ? 'Edit Knowledge' : 'Create Knowledge'))
const dialogButtonLabel = computed(() => (isEditMode.value ? 'Save' : 'Create'))
 defineProps<{
  visible: boolean
  roleId: number
}>()
const isEditMode = ref(!!level.value)
const localLevel = ref<Level>({ name: '', minCoefficient: 0, maxCoefficient: 0, link: '' })

const router = useRouter()
const newLevelTitle = computed(() => {
  return `${newLevel.value.name || 'New Level'}`
})
const levelsStore = useLevelStore()
const role = ref<Role>()
const emits = defineEmits(['update:visible', 'confirm-edit', 'confirm-create'])

onMounted(async () => {
  const levelId = router.currentRoute.value.params.id?.toString()
  if(levelId){

  level.value = await roleStore.getLevelById(levelId)
    role.value = await roleStore.loadRoleById(level.value.roleId!.toString())
  }
})

const redirectToRoleView = () => {
  router.push({ name: 'RoleView', params: { id: level.value?.roleId } })
  SuccessMessage('Your level was created')
}
const hideDialog = () => {
  emits('update:visible', false)
}

const saveForm = async () => {
  try {
    if (isEditMode.value) {
      level!.value.name = localLevel.value.name
      level!.value.minCoefficient = localLevel.value.minCoefficient
      level!.value.maxCoefficient = localLevel.value.maxCoefficient
      level!.value.link = localLevel.value.link
      await levelsStore.editLevel(level!.value)
      SuccessMessage('Knowledge updated successfully')
      emits('confirm-edit')
    } else {
      await levelsStore.addLevel(localLevel.value, role.value!)
      localLevel.value = { name: '', minCoefficient: 0, maxCoefficient: 0, link: '' }
      SuccessMessage('Level created successfully')
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
const createLevel = async () => {
  try {
    if (newLevel.value.name == '' || newLevel.value.link == '') {
      ErrorMessage('You need to fill all the fields')
      return
    }
    if (newLevel.value.maxCoefficient == 0 || newLevel.value.maxCoefficient > 100) {
      ErrorMessage('MaxRange should be bigger than 0 and smaller than 100')
      return
    }
    if (newLevel.value.maxCoefficient <= newLevel.value.minCoefficient) {
      ErrorMessage('MaxRange should be bigger than MinRange')
      return
    }
    await levelsStore.addLevel(newLevel.value, role.value!)
    redirectToRoleView()
  } catch (error: any) {
    if (error.status === HttpServerError.HTTP_STATUS_CODE_CONFLICT) {
      ErrorMessage('This level name already exists')
    }
    if (error.status === HttpServerError.HTTP_SERVER_ERROR) {
      ErrorMessage('Maximum and Minimum range overlap')
    }
  }
}

const updateLevel = async () => {
  try {
    if (level.value.name === '' || level.value.link === '') {
      ErrorMessage('You need to fill all the fields')
      return
    }
    if (level.value.maxCoefficient === 0 || level.value.maxCoefficient > 100) {
      ErrorMessage('MaxRange should be bigger than 0 and smaller than 100')
      return
    }
    if (level.value.maxCoefficient <= level.value.minCoefficient) {
      ErrorMessage('MaxRange should be bigger than MinRange')
      return
    }

    await editLevel(level.value)
    redirectToRoleView()
  } catch (error: any) {
    if (error.status === HttpServerError.HTTP_STATUS_CODE_CONFLICT) {
      ErrorMessage('This level name already exists')
    }
    if (error.status === HttpServerError.HTTP_SERVER_ERROR) {
      ErrorMessage('Maximum and Minimum range overlap')
    }
  }
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
