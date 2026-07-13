<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
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
              <input v-model="profileForm.firstName" class="input-field" placeholder="Prénom" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">Nom</label>
              <input v-model="profileForm.lastName" class="input-field" placeholder="Nom" />
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

          <p v-if="profileMessage" :class="profileSuccess ? 'text-sage' : 'text-clay'" class="text-sm rounded-lg px-3 py-2 bg-sage/10">
            {{ profileMessage }}
          </p>

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
            <input v-model="passwordForm.currentPassword" type="password" class="input-field" placeholder="••••••••" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Nouveau mot de passe</label>
            <input v-model="passwordForm.newPassword" type="password" class="input-field" placeholder="••••••••" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">Confirmer le nouveau mot de passe</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="input-field" placeholder="••••••••" />
          </div>

          <p v-if="passwordMessage" :class="passwordSuccess ? 'text-sage' : 'text-clay'" class="text-sm rounded-lg px-3 py-2 bg-sage/10">
            {{ passwordMessage }}
          </p>

          <button type="submit" :disabled="savingPassword" class="btn-primary w-full sm:w-auto">
            {{ savingPassword ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const authStore = useAuthStore();
const api = useApi();

const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const savingProfile = ref(false);
const savingPassword = ref(false);
const profileMessage = ref('');
const passwordMessage = ref('');
const profileSuccess = ref(false);
const passwordSuccess = ref(false);

const syncProfile = () => {
  if (!authStore.user) return;
  profileForm.firstName = authStore.user.firstName || '';
  profileForm.lastName = authStore.user.lastName || '';
  profileForm.email = authStore.user.email || '';
  profileForm.phone = authStore.user.phone || '';
};

watch(() => authStore.user, syncProfile, { immediate: true });

const saveProfile = async () => {
  savingProfile.value = true;
  profileMessage.value = '';
  profileSuccess.value = false;

  try {
    const updatedUser = await api('/auth/me', {
      method: 'PATCH',
      body: {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      },
    });

    authStore.setUser(updatedUser as any);
    profileSuccess.value = true;
    profileMessage.value = 'Profil mis à jour avec succès.';
  } catch (error: any) {
    profileSuccess.value = false;
    profileMessage.value = error?.data?.message || 'Impossible de mettre à jour le profil.';
  } finally {
    savingProfile.value = false;
  }
};

const changePassword = async () => {
  passwordMessage.value = '';
  passwordSuccess.value = false;

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordSuccess.value = false;
    passwordMessage.value = 'La confirmation du mot de passe ne correspond pas.';
    return;
  }

  savingPassword.value = true;

  try {
    await api('/auth/change-password', {
      method: 'PATCH',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    });

    passwordSuccess.value = true;
    passwordMessage.value = 'Mot de passe mis à jour avec succès.';
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error: any) {
    passwordSuccess.value = false;
    passwordMessage.value = error?.data?.message || 'Impossible de changer le mot de passe.';
  } finally {
    savingPassword.value = false;
  }
};
</script>