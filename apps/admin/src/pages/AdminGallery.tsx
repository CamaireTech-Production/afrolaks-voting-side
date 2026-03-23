import { useState } from 'react';
import { useAdminGallery } from '../hooks/useAdminGallery';
import { Trash2, Plus, ImageIcon } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { DeleteConfirmDialog } from '../components/modals/DeleteConfirmDialog';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  category?: string;
  createdAt: any;
}

export default function AdminGallery() {
  const { images, loading, error, addImage, updateImage, deleteImage } = useAdminGallery();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);

  const CATEGORIES = ['event', 'gallery', 'promo', 'other'];

  const handleAddClick = () => {
    setEditingImage(null);
    setFormData({ url: '', alt: '', category: '', order: 0 });
    setIsModalOpen(true);
  };

  const handleEditClick = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      url: image.url,
      alt: image.alt,
      category: image.category || '',
      order: image.order,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (image: GalleryImage) => {
    setDeletingImage(image);
    setIsDeleteDialogOpen(true);
  };

  const [formData, setFormData] = useState({
    url: '',
    alt: '',
    category: '',
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingImage) {
        await updateImage(editingImage.id, {
          ...formData,
          id: editingImage.id,
          createdAt: editingImage.createdAt,
        } as any);
      } else {
        await addImage(formData as any);
      }
      setIsModalOpen(false);
      setEditingImage(null);
      setFormData({ url: '', alt: '', category: '', order: 0 });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingImage) {
      await deleteImage(deletingImage.id);
      setIsDeleteDialogOpen(false);
      setDeletingImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/50">
        <h2 className="text-xl font-bold text-[#FF0000] mb-2">Erreur</h2>
        <p className="text-gray-300">{error}</p>
      </div>
    );
  }

  const filteredImages = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : images;

  const sortedImages = [...filteredImages].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      {/* Header - Mobile First */}
      <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Gérer la Galerie</h1>
          <p className="text-xs md:text-base text-gray-400">Ajoutez, modifiez et supprimez les images de la galerie</p>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black text-sm md:text-base font-bold hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Ajouter
        </button>
      </div>

      {/* Filter - Mobile First */}
      <div className="space-y-2 md:space-y-0 md:flex md:gap-4 md:items-end">
        <div className="flex-1">
          <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Filtrer par catégorie</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 border border-white/20 text-white text-sm md:text-base focus:outline-none focus:border-[#FFBD01] transition-colors"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory('')}
            className="w-full md:w-auto px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 text-sm md:text-base transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Gallery Grid - Mobile First */}
      <div className="w-full">
        {sortedImages.length === 0 ? (
          <div className="p-6 md:p-8 rounded-lg md:rounded-2xl bg-white/5 border border-white/10 text-center">
            <ImageIcon className="w-10 md:w-12 h-10 md:h-12 text-gray-500 mx-auto mb-3 md:mb-4" />
            <p className="text-sm md:text-base text-gray-400">
              {selectedCategory
                ? `Aucune image dans la catégorie "${selectedCategory}"`
                : 'Aucune image pour le moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className="w-full rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFBD01]/50 transition-all overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-40 md:h-48 bg-black">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  {/* Order Badge */}
                  <div className="absolute top-2 md:top-3 left-2 md:left-3 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-black/70 border border-white/20">
                    <span className="text-xs font-bold text-[#FFBD01]">#{index + 1}</span>
                  </div>
                  {/* Category Badge */}
                  {image.category && (
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-black/70">
                      <span className="text-xs font-semibold text-white">{image.category}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-gray-300 line-clamp-2 mb-3">{image.alt}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(image)}
                      className="flex-1 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm bg-white/10 hover:bg-white/20 text-[#FFBD01] font-medium transition-colors"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDeleteClick(image)}
                      className="flex-1 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm bg-white/10 hover:bg-red-500/20 text-[#FF0000] font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Add/Edit Modal - Mobile Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-lg md:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 sticky top-0 bg-black">
              <h2 className="text-lg md:text-xl font-bold text-white uppercase">
                {editingImage ? 'Éditer l\'image' : 'Ajouter une image'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 md:p-6 space-y-4">
              <ImageUpload
                value={formData.url}
                onChange={(url) => setFormData({ ...formData, url })}
                disabled={isSubmitting}
                folder="gallery"
                label="Image de Galerie"
              />

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Description (Alt)</label>
                <textarea
                  name="alt"
                  value={formData.alt}
                  onChange={handleFormChange}
                  placeholder="Description de l'image"
                  disabled={isSubmitting}
                  rows={2}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
                >
                  <option value="">Aucune catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Ordre d'affichage</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base bg-white/10 hover:bg-white/20 text-white font-bold transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full text-sm md:text-base bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingImage(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer l'image ?"
        description={`Êtes-vous sûr de vouloir supprimer l'image "${deletingImage?.alt}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
