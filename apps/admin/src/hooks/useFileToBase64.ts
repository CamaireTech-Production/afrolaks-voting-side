import { useState } from 'react';

/**
 * Hook pour convertir un fichier en base64
 * @returns Object avec la fonction convertFile et l'état base64
 */
export function useFileToBase64() {
  const [base64, setBase64] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const convertFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError('');

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const base64String = event.target?.result as string;
          setBase64(base64String);
          setLoading(false);
          resolve(base64String);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Erreur de conversion';
          setError(errorMsg);
          setLoading(false);
          reject(err);
        }
      };

      reader.onerror = () => {
        const errorMsg = 'Erreur lors de la lecture du fichier';
        setError(errorMsg);
        setLoading(false);
        reject(new Error(errorMsg));
      };

      reader.readAsDataURL(file);
    });
  };

  return {
    base64,
    loading,
    error,
    convertFile,
  };
}
