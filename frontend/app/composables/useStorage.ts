export const useStorage = () => {
  const api = useApi();

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api<{ objectName: string; url: string }>('/storage/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return { uploadImage };
};
