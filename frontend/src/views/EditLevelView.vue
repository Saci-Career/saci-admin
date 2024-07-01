<template>
  <div class="Container">
    <img src="@/assets/images/logo-and-lettering.svg" alt="Saci Logo" />
    <h1>{{ level }}</h1>
    <h2>Basic Information</h2>
    <div class="NameContainer">
      <h5>Name</h5>
      <ElInput placeholder="Level Name" v-model="level.name" />
    </div>
    <div class="LinkAndCoeficientsContainer">
      <div class="CoeficientsContainer">
        <h5>Coeficient Range</h5>
        <span>
          <ElInputNumber v-model="level.minCoefficient" :min="0" :max="100" />
          <h4>to</h4>
          <ElInputNumber v-model="level.maxCoefficient" :min="level.minCoefficient" :max="100" />
        </span>
      </div>
      <div class="LinkField">
        <h5>Link to Knowledge Path</h5>
        <ElInput placeholder="Link" v-model="level.link"></ElInput>
      </div>
    </div>
    <div class="SaveButton">
      <ElButton type="primary" @click="updateLevel"> Save </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElInput, ElButton, ElInputNumber } from 'element-plus'
import { ErrorMessage, SuccessMessage } from '@/services/messages'
import { useLevelStore } from '@/stores/levels'
import { editLevel } from '@/stores/levels/actions'
import type { Level } from '@/domain/Level'
import { HttpServerError } from '@/services/http'

const levelStore = useLevelStore()

const level = ref<Level>({} as Level)
const router = useRouter()
const newLevelTitle = computed(() => {
  return `${level.value?.name || ''} - ${level.value.name || 'Edit Level'}`
})

onMounted(async () => {
  const levelId = router.currentRoute.value.params.id as string
  level.value = (await levelStore.getLevelById(levelId)) ?? {}
})

const redirectToRoleView = () => {
  router.push('/role-view')
  SuccessMessage('Your level was edited')
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
