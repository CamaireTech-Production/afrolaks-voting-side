import { useEffect, useState } from 'react';

interface InstagramPreviewProps {
  url: string;
}

export function InstagramPreview({ url }: InstagramPreviewProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      setError(false);
      try {
        // Utiliser microlink.io pour extraire la preview du lien
        const response = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(url)}`
        );
        const data = await response.json();

        if (data.data?.image?.url) {
          setImage(data.data.image.url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erreur lors de l\'extraction de la preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div className="relative overflow-hidden w-full md:w-40 h-40 md:h-auto bg-black flex-shrink-0 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#FFBD01]"></div>
      </div>
    );
  }

  if (error || !image) {
    return null;
  }

  return (
    <div className="relative overflow-hidden w-full md:w-40 h-40 md:h-auto bg-black flex-shrink-0">
      <img
        src={image}
        alt="Instagram preview"
        className="w-full h-full object-cover"
        onError={() => setImage(null)}
      />
    </div>
  );
}
