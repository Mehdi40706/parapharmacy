<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Utilisateurs</h1>

    <input
      v-model="search"
      @input="debouncedSearch"
      type="text"
      placeholder="Rechercher par nom ou email..."
      class="input-field max-w-sm mb-6"
    />

    <div class="bg-white rounded-2xl border border-mist overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-mist/50">
          <tr class="text-left">
            <th class="p-4">Nom</th>
            <th class="p-4">Email</th>
            <th class="p-4">Rôle</th>
            <th class="p-4">Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t border-mist">
            <td class="p-4 font-medium">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="p-4 text-ink/60">{{ user.email }}</td>
            <td class="p-4">
              <select
                :value="user.role"
                @change="handleRoleChange(user.id, ($event.target as HTMLSelectElement).value)"
                class="input-field text-xs py-1"
              >
                <option value="CLIENT">Client</option>
                <option value="ADMIN">Admin</option>
              </select>
            </td>
            <td class="p-4 text-ink/60">{{ new Date(user.createdAt).toLocaleDateString('fr-FR') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

import { useDebounceFn } from '@vueuse/core';
import type { User } from '~/types/user';

const { fetchUsers, updateUserRole } = useAdminUsers();

const users = ref<User[]>([]);
const search = ref('');

const load = async () => {
  const result = await fetchUsers({ search: search.value || undefined });
  users.value = result.data;
};

const debouncedSearch = useDebounceFn(load, 400);

const handleRoleChange = async (id: string, role: string) => {
  await updateUserRole(id, role as 'CLIENT' | 'ADMIN');
  await load();
};

onMounted(load);
</script>