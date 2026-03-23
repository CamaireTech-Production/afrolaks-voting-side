import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  category?: string;
  createdAt?: any;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<GalleryImage, 'createdAt'>) => Promise<void>;
  image?: GalleryImage;
  mode: 'add' | 'edit';
  categories: string[];
}

export function GalleryModal({
  isOpen,
  onClose,
  onSubmit,
  image,
  mode,
  categories,
}: GalleryModalProps) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState(0);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (image) {
      setUrl(image.url);
      setAlt(image.alt);
      setCategory(image.category || '');
      setOrder(image.order);
      setImagePreviewError(false);
    } else {
      setUrl('');
      setAlt('');
      setCategory('');
      setOrder(0);
      setImagePreviewError(false);
    }
    setError('');
  }, [image, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim() || !alt.trim()) {
      setError('L\'URL et la description sont requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: image?.id || '',
        url: url.trim(),
        alt: alt.trim(),
        category: category || undefined,
        order,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black">
          <h2 className="text-xl font-bold text-white uppercase">
            {mode === 'add' ? 'Ajouter une image' : 'Éditer l\'image'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-[#FF0000]/20 border border-[#FF0000]/50">
              <p className="text-[#FF0000] text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">URL de l'image</label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setImagePreviewError(false);
              }}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
            />

            {/* Image Preview */}
            {url && !imagePreviewError && (
              <div className="mt-3">
                <img
                  src={url}
                  alt="Preview"
                  onError={() => setImagePreviewError(true)}
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
            )}
            {imagePreviewError && (
              <div className="mt-3 h-40 rounded-xl bg-white/5 border border-[#FF0000]/30 flex items-center justify-center">
                <p className="text-[#FF0000] text-sm">Erreur de chargement de l'image</p>
              </div>
            )}
          </div>

          {/* Alt Text (Description) */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Description</label>
            <textarea
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Décrivez cette image..."
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50 resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Catégorie (optionnel)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
            >
              <option value="">Sélectionnez une catégorie (optionnel)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Ordre d'affichage</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
