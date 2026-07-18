<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div class="w-10 h-10 border-4 border-mist border-t-sage rounded-full animate-spin" />
    <p class="text-ink/60 text-sm">Connexion en cours...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

onMounted(async () => {
  const accessToken = route.query.access_token as string | undefined;
  const refreshToken = route.query.refresh_token as string | undefined;
  const error = route.query.error as string | undefined;

  if (error) {
    toast.error('La connexion avec Google a échoué. Merci de réessayer.');
    router.replace('/auth/login');
    return;
  }

  if (!accessToken || !refreshToken) {
    toast.error('Connexion invalide.');
    router.replace('/auth/login');
    return;
  }

  try {
    authStore.setTokens(accessToken, refreshToken);
    await authStore.fetchProfile(accessToken); // token passé directement, même fix que login/register

    // Nettoie l'URL des tokens visibles avant de continuer (historique navigateur)
    if (authStore.isAdmin) {
      router.replace('/admin');
    } else {
      router.replace('/produits');
    }
  } catch {
    toast.error('Impossible de finaliser la connexion.');
    router.replace('/auth/login');
  }
});
</script>