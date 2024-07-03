<script setup lang="ts">
import { useRolesStore } from '@/stores/roles/index'
import type { Role } from '@/domain/Role'
import { ElButton, ElInput, ElDialog, ElTable, ElTableColumn } from 'element-plus'
import { ref, onMounted } from 'vue'
import { ErrorMessage, SuccessMessage } from '@/services/messages'
import { HttpServerError } from '@/services/http'
import { useRouter } from 'vue-router'

const dialogFormVisible = ref(false)
const rolesStore = useRolesStore()
const selectedRoleToUpdate = ref()
const selectedRoleToDelete = ref()
const deleteDialogForm = ref(false)
const createRoleDialogFormVisible = ref(false)
const newRoleName = ref('')
const router = useRouter()
const originalRoleName = ref('')

const navigateToRoleDetails = (row: Role) => {
  router.push({ name: 'RoleView', params: { roleId: row.id } })
}

const openUpdateDialog = (row: Role) => {
  dialogFormVisible.value = true
  selectedRoleToUpdate.value = row
  originalRoleName.value = row.name
}

const openDeleteDialog = (row: Role) => {
  deleteDialogForm.value = true
  selectedRoleToDelete.value = row.id
}

onMounted(async () => {
  await rolesStore.fetchRoles()
})

async function deleteRole() {
  try {
    await rolesStore.removeRole(selectedRoleToDelete.value)
    SuccessMessage('Role removed!')
    closeDeleteDialog()
  } catch (error) {
    ErrorMessage('Error deleting the role')
  }
}

const closeDeleteDialog = () => {
  deleteDialogForm.value = false
}

const closeDialog = () => {
  dialogFormVisible.value = false
  selectedRoleToUpdate.value.name = originalRoleName.value
}

const saveForm = async () => {
  try {
    await rolesStore.editRoleAction(selectedRoleToUpdate.value)
    SuccessMessage('Role updated successfully')
    closeDialog()
  } catch (error) {
    ErrorMessage('Unexpected error updating the role')
  }
}

const showCreateRoleDialog = () => {
  createRoleDialogFormVisible.value = true
}

const hideCreateRoleDialog = () => {
  createRoleDialogFormVisible.value = false
}

const createRole = async () => {
  if (newRoleName.value == '') {
    ErrorMessage('You need to fill in this field')
    showCreateRoleDialog()
    return
  }

  try {
    await rolesStore.addRole({
      name: newRoleName.value
    })
    SuccessMessage('Your role was created')
    hideCreateRoleDialog()
  } catch (error: any) {
    if (error.status === HttpServerError.HTTP_STATUS_CODE_CONFLICT) {
      ErrorMessage('This name already exists')
    }
  }

  newRoleName.value = ''
}
</script>

<template>
  <ElDialog v-model="dialogFormVisible" title="Edit Role" width="500">
    <ElInput v-model="selectedRoleToUpdate.name" autocomplete="on" />
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDialog">Cancel</ElButton>
        <ElButton type="primary" @click="saveForm">Save</ElButton>
      </div>
    </template>
  </ElDialog>
  <ElDialog v-model="deleteDialogForm" title="Warning" width="500">
    <span>Role will be permanently removed. Continue?</span>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDeleteDialog">Cancel</ElButton>
        <ElButton type="primary" @click="deleteRole()"> Confirm </ElButton>
      </div>
    </template>
  </ElDialog>
  <div class="PageWrapper">
    <div class="Container">
      <img src="@/assets/images/logo-and-lettering.svg" alt="Saci Logo" />
      <h2>Roles</h2>
      <ElTable :data="rolesStore.getRoles" style="width: 100%">
        <ElTableColumn prop="name" label="Names">
          <template #default="{ row }">
            <span class="RoleName" @click="navigateToRoleDetails(row)">{{ row.name }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" label="Actions" width="150">
          <template #default="{ row }">
            <ElButton @click="openDeleteDialog(row)" type="text" size="small">Delete</ElButton>
            <ElButton @click="openUpdateDialog(row)" type="text" size="small">Edit</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="NewRole">
        <ElButton type="primary" @click="showCreateRoleDialog"> Create Role </ElButton>
        <ElDialog
          v-model="createRoleDialogFormVisible"
          title="New Role"
          width="500"
          style="text-align: left"
        >
          <ElInput v-model="newRoleName" placeholder="Role name" />

          <template #footer>
            <div class="dialog-footer">
              <ElButton @click="hideCreateRoleDialog">Cancel</ElButton>
              <ElButton type="primary" @click="createRole"> Confirm </ElButton>
            </div>
          </template>
        </ElDialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.RoleName {
  cursor: pointer;
}

.PageWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.NewRole {
  padding-top: 40px;
  text-align: right;
  padding-right: 10px;
}

.NewRole button {
  font-size: 13px;
}

.Container {
  width: 800px;
  height: auto;
  margin: auto;
  text-align: center;
  img {
    width: 100px;
  }
}
</style>
