<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <BackButton label="Retour" class="mb-6" />
    <div>
      <h1 class="text-2xl font-semibold text-ink">Mon compte</h1>
      <p class="text-sm text-ink/60">Mettez à jour vos informations personnelles et votre mot de passe.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="bg-white rounded-2xl border border-sage/10 p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Informations personnelles</h2>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium mb-1.5">Prénom</label>
              <input v-model="profileForm.firstName" class="input-field" placeholder="Prénom" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">Nom</label>
              <input v-model="profileForm.lastName" class="input-field" placeholder="Nom" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Email</label>
            <input v-model="profileForm.email" type="email" class="input-field" disabled />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Téléphone</label>
            <input v-model="profileForm.phone" class="input-field" placeholder="Téléphone" />
          </div>

          <button type="submit" :disabled="savingProfile" class="btn-primary w-full sm:w-auto">
            {{ savingProfile ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </form>
      </section>

      <section class="bg-white rounded-2xl border border-sage/10 p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Changer le mot de passe</h2>

        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">Mot de passe actuel</label>
            <input v-model="passwordForm.currentPassword" type="password" class="input-field" placeholder="••••••••" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Nouveau mot de passe</label>
            <input v-model="passwordForm.newPassword" type="password" class="input-field" placeholder="••••••••" required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Confirmer le nouveau mot de passe</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="input-field" placeholder="••••••••" required />
          </div>

          <button type="submit" :disabled="savingPassword" class="btn-primary w-full sm:w-auto">
            {{ savingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackButton from '~/components/common/BackButton.vue';
import { useAccountForm } from '~/composables/useAccountForm';

definePageMeta({ middleware: 'auth' });

const {
  profileForm,
  passwordForm,
  savingProfile,
  savingPassword,
  saveProfile,
  changePassword,
} = useAccountForm();
</script>