import { useState } from 'react';

interface UploadResult {
  url: string;
  fileName: string;
}

interface UseImageUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<UploadResult>;
  uploadProgress: number;
}

/**
 * Hook pour convertir les images en base64 et les stocker dans Firestore
 * Aucun upload serveur - tout en base64 dans la BD
 */
export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Valider le fichier
      if (!file) {
        throw new Error('Aucun fichier sélectionné');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image (PNG, JPG, GIF, WebP, etc.)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille maximale est 5MB');
      }

      console.log(`📤 Conversion en base64: ${file.name}`);

      // Convertir le fichier en base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result as string;
          console.log(`✅ Conversion réussie: ${file.name} (${base64String.length} caractères)`);

          setUploadProgress(100);

          resolve({
            url: base64String, // C'est le base64 qui sera stocké dans Firestore
            fileName: file.name,
          });
        };

        reader.onerror = () => {
          const errorMsg = 'Erreur lors de la lecture du fichier';
          console.error(`❌ ${errorMsg}`);
          setError(errorMsg);
          reject(new Error(errorMsg));
        };

        reader.readAsDataURL(file);
      });
    } catch (err) {
      const errorMsg = (err as Error).message;
      console.error('❌ Erreur conversion base64:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploading,
    error,
    uploadImage,
    uploadProgress,
  };
}
