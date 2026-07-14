import { useToast } from "./useToast";

export const useAccountForm = () => {
  const authStore = useAuthStore();
  const api = useApi();
  const toast = useToast();

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
      toast.success('Profil mis à jour avec succès.');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Impossible de mettre à jour le profil.');
    } finally {
      savingProfile.value = false;
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('La confirmation du mot de passe ne correspond pas.');
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

      toast.success('Mot de passe mis à jour avec succès.');
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } catch (error: any) {
      toast.error(error?.data?.message || 'Impossible de changer le mot de passe.');
    } finally {
      savingPassword.value = false;
    }
  };

  return {
    profileForm,
    passwordForm,
    savingProfile,
    savingPassword,
    saveProfile,
    changePassword,
  };
};