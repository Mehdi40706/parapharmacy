<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Utilisateurs</h1>
    <div class="relative mb-6 max-w-md">
      <Icon
        name="lucide:search"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
      />
      <input
        v-model="search"
        @input="debouncedSearch"
        type="text"
        placeholder="Rechercher un utilisateur..."
        class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-sage focus:ring-4 focus:ring-sage/20"
      />
    </div>
    <!-- Vue tableau (desktop) -->
    <div class="hidden md:block rounded-2xl border border-mist bg-white overflow-visible">     
      <table class="w-full text-sm">
        <thead class="bg-mist/50">
          <tr class="text-center">
            <th class="p-4">Nom</th>
            <th class="p-4">Email</th>
            <th class="p-4">Rôle</th>
            <th class="p-4">Inscrit le</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t border-mist text-center">
            <td class="p-4 font-medium">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="p-4">
              <div class="flex items-center justify-center gap-2 text-slate-600">
                <Icon name="lucide:mail" class="w-4 h-4" />
                {{ user.email }}
              </div>
            </td>            <td class="p-4">
              <div class="relative flex items-center gap-2 w-40">
                <!-- Role Icon -->
                <div
                  :class="[
                    'absolute left-3 flex items-center',
                    user.role === 'ADMIN' ? 'text-amber-500' : 'text-emerald-500'
                  ]"
                >
                  <Icon
                    :name="user.role === 'ADMIN'
                      ? 'lucide:shield-check'
                      : 'lucide:user-round'"
                    class="w-4 h-4"
                  />
                </div>
                <select
                  :value="user.role"
                  @change="handleRoleChange(user.id, ($event.target as HTMLSelectElement).value)"
                  :class="[
                    'w-full appearance-none rounded-xl border bg-white py-2 pl-10 pr-10 text-sm font-medium shadow-sm transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-sage/30',
                    user.role === 'ADMIN'
                      ? 'border-amber-200 text-amber-700'
                      : 'border-emerald-200 text-emerald-700'
                  ]"
                >
                  <option value="CLIENT">Client</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
                <!-- Dropdown Arrow -->
                <div class="pointer-events-none absolute right-3 text-slate-400">
                  <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
                </div>
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center justify-center gap-2 text-slate-500">
                <Icon name="lucide:calendar-days" class="w-4 h-4" />
                {{ new Date(user.createdAt).toLocaleDateString('fr-FR',{
                  day:'numeric',
                  month:'short',
                  year:'numeric'
                }) }}
              </div>
            </td>
            <td class="p-4">
              <div class="flex justify-center">
                <ActionsMenu>
                  <template #default="{ close }">
                    <ActionsMenuItem label="Supprimer" icon="lucide:trash-2" danger @click="askDelete(user); close()" />
                  </template>
                </ActionsMenu>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && users.length === 0" class="text-center py-12 text-ink/60 text-sm">
        Aucun utilisateur ne correspond à votre recherche.
      </div>
    </div>

    <!-- Vue cartes (mobile) -->
    <div class="md:hidden flex flex-col gap-3">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white rounded-2xl border border-mist p-4"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="min-w-0">
            <p class="font-medium truncate">{{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-ink/60 text-sm truncate">{{ user.email }}</p>
          </div>
          <ActionsMenu>
        <template #default="{ close }">
          <ActionsMenuItem
            label="Supprimer"
            icon="lucide:trash-2"
            danger
            @click="askDelete(user); close()"
          />
        </template>
      </ActionsMenu>
        </div>

        <div class="flex items-center justify-between gap-3 text-sm">
          <select
            :value="user.role"
            @change="handleRoleChange(user.id, ($event.target as HTMLSelectElement).value)"
            class="input-field text-xs py-1 w-32"
          >
            <option value="CLIENT">Client</option>
            <option value="ADMIN">Admin</option>
          </select>
          <span class="text-ink/60 text-xs">
            Inscrit le {{ new Date(user.createdAt).toLocaleDateString('fr-FR') }}
          </span>
        </div>
      </div>

      <div v-if="!loading && users.length === 0" class="text-center py-12 text-ink/60 text-sm">
        Aucun utilisateur ne correspond à votre recherche.
      </div>
    </div>

    <ConfirmModal
      :open="!!userToDelete"
      title="Supprimer l'utilisateur ?"
      :loading="deleting"
      @cancel="userToDelete = null"
      @confirm="confirmDelete"
    >
      Cette action est irréversible. Voulez-vous vraiment supprimer
      <span class="font-medium text-ink">{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</span> ?
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

import { useDebounceFn } from '@vueuse/core';
import ActionsMenu from '~/components/common/ActionsMenu.vue';
import ActionsMenuItem from '~/components/common/ActionsMenuItem.vue';
import ConfirmModal from '~/components/common/ConfirmModal.vue';
import type { User } from '~/types/user';

const { fetchUsers, updateUserRole, deleteUser } = useAdminUsers();
const toast = useToast();

const users = ref<User[]>([]);
const search = ref('');
const loading = ref(true);
const userToDelete = ref<User | null>(null);
const deleting = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const result = await fetchUsers({ search: search.value || undefined });
    users.value = result.data;
  } catch {
    toast.error('Impossible de charger les utilisateurs.');
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = useDebounceFn(load, 400);

const handleRoleChange = async (id: string, role: string) => {
  const previousRole = users.value.find((u) => u.id === id)?.role;
  try {
    await updateUserRole(id, role as 'CLIENT' | 'ADMIN');
    toast.success('Rôle mis à jour.');
    await load();
  } catch {
    toast.error('Échec de la mise à jour du rôle.');
    if (previousRole) await load(); 
  }
};

const askDelete = (user: User) => {
  userToDelete.value = user;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  const name = `${userToDelete.value.firstName} ${userToDelete.value.lastName}`;
  deleting.value = true;
  try {
    await deleteUser(userToDelete.value.id);
    toast.success(`${name} a été supprimé.`);
    userToDelete.value = null;
    await load();
  } catch {
    toast.error(`Échec de la suppression de ${name}.`);
  } finally {
    deleting.value = false;
  }
};

onMounted(load);
</script>