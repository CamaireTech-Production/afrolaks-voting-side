import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'createdAt' | 'updatedAt'>) => Promise<void>;
  category?: Category;
  mode: 'add' | 'edit';
}

export function CategoryModal({ isOpen, onClose, onSubmit, category, mode }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
      setIcon(category.icon || '');
      setOrder(category.order);
    } else {
      setName('');
      setDescription('');
      setIcon('');
      setOrder(0);
    }
    setError('');
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim()) {
      setError('Le nom et la description sont requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: category?.id || '',
        name: name.trim(),
        description: description.trim(),
        icon: icon.trim() || undefined,
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
      <div className="bg-black border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black">
          <h2 className="text-xl font-bold text-white uppercase">
            {mode === 'add' ? 'Ajouter une catégorie' : 'Éditer la catégorie'}
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

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Best DJ"
              disabled={isSubmitting || mode === 'edit'}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez cette catégorie..."
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50 resize-none"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Icône (optionnel)</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="ex: 🎧 ou emoji/icon-name"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
            />
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
