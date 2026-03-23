import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import { ImageUpload } from '../ImageUpload';

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
}

interface Nominee {
  id: string;
  name: string;
  image: string;
  categoryId: string;
  voteCount: number;
  order: number;
  isActive: boolean;
}

interface NomineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Nominee, 'createdAt' | 'updatedAt' | 'voteCount'>) => Promise<void>;
  nominee?: Nominee;
  mode: 'add' | 'edit';
  categories: Category[];
}

export function NomineeModal({
  isOpen,
  onClose,
  onSubmit,
  nominee,
  mode,
  categories: categoriesProp,
}: NomineeModalProps) {
  // Récupérer les catégories localement aussi pour s'assurer qu'elles sont à jour
  const { categories: categoriesLocal, addCategory } = useAdminCategories();
  const categories = categoriesProp && categoriesProp.length > 0 ? categoriesProp : categoriesLocal;

  const [name, setName] = useState('');
  const [nomineeId, setNomineeId] = useState('');
  const [image, setImage] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  useEffect(() => {
    if (nominee) {
      setNomineeId(nominee.id);
      setName(nominee.name);
      setImage(nominee.image);
      setCategoryId(nominee.categoryId);
      setOrder(nominee.order ?? 0);
      setIsActive(nominee.isActive);
      setImagePreviewError(false);
    } else {
      setNomineeId('');
      setName('');
      setImage('');
      setCategoryId('');
      setOrder(0);
      setIsActive(true);
      setImagePreviewError(false);
    }
    setError('');
  }, [nominee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !image.trim() || !categoryId) {
      setError('Le nom, l\'image et la catégorie sont requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: nomineeId,
        name: name.trim(),
        image: image.trim(),
        categoryId,
        order,
        isActive,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    try {
      const maxOrder = Math.max(0, ...categories.map((c) => c.order || 0));
      await addCategory({
        id: '',
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim() || 'Nouvelle catégorie',
        order: maxOrder + 1,
      });
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      setNewCategoryDesc('');
      // Le hook va mettre à jour les catégories automatiquement
    } catch (err) {
      setError(`Erreur: ${(err as Error).message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/10 rounded-xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 sticky top-0 bg-black">
          <h2 className="text-lg md:text-xl font-bold text-white uppercase">
            {mode === 'add' ? 'Ajouter' : 'Éditer'}
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
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {error && (
            <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-[#FF0000]/20 border border-[#FF0000]/50">
              <p className="text-[#FF0000] text-xs md:text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: DJ Spinall"
              disabled={isSubmitting}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
            />
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={image}
            onChange={setImage}
            disabled={isSubmitting}
            folder="nominees"
            label="Photo"
          />

          {/* Category */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Catégorie</label>
            {showNewCategoryInput ? (
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nom"
                  disabled={isSubmitting}
                  className="w-full px-3 md:px-4 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
                />
                <textarea
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Description"
                  disabled={isSubmitting}
                  rows={2}
                  className="w-full px-3 md:px-4 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isSubmitting || !newCategoryName.trim()}
                    className="flex-1 px-3 py-2 rounded-lg text-xs md:text-sm bg-[#FFBD01]/20 hover:bg-[#FFBD01]/30 text-[#FFBD01] font-semibold disabled:opacity-50 transition-colors"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryInput(false)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs md:text-sm bg-white/10 hover:bg-white/20 text-gray-400 font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base bg-[#1a1a1a] border border-[#FFBD01]/30 text-[#FFBD01] focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
                  style={{
                    colorScheme: 'dark',
                  }}
                  required
                >
                  <option value="">Sélectionnez {categories.length === 0 ? '(aucune)' : ''}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Aucune catégorie</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(true)}
                  className="w-full mt-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm bg-white/5 hover:bg-white/10 text-[#FFBD01] font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle catégorie
                </button>
              </>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Ordre</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              disabled={isSubmitting}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 md:w-5 md:h-5 cursor-pointer disabled:opacity-50"
            />
            <label htmlFor="isActive" className="text-xs md:text-sm font-bold text-gray-300 uppercase cursor-pointer">
              Actif
            </label>
          </div>

          {/* Vote Count (Read-only if editing) */}
          {mode === 'edit' && nominee && (
            <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs md:text-sm text-gray-400">Votes: <span className="text-[#FFBD01] font-bold">{nominee.voteCount}</span></p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 md:gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base bg-white/10 hover:bg-white/20 text-white font-bold transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
