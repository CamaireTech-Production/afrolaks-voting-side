import { useState } from 'react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { CategoryModal } from '../components/modals/CategoryModal';
import { DeleteConfirmDialog } from '../components/modals/DeleteConfirmDialog';

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  createdAt: any;
  updatedAt: any;
}

export default function AdminCategories() {
  const { categories, loading, error, addCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Category, 'createdAt' | 'updatedAt'>) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCategory) {
      await deleteCategory(deletingCategory.id);
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement des catégories...</p>
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

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      {/* Header - Mobile First */}
      <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Gérer les Catégories</h1>
          <p className="text-xs md:text-base text-gray-400">Créez, modifiez et supprimez les catégories de votation</p>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black text-sm md:text-base font-bold hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Ajouter
        </button>
      </div>

      {/* Categories Grid - Mobile First */}
      <div className="w-full">
        {sortedCategories.length === 0 ? (
          <div className="p-6 md:p-8 rounded-lg md:rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-sm md:text-base text-gray-400">Aucune catégorie pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {sortedCategories.map((category) => (
              <div key={category.id} className="w-full rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFBD01]/50 transition-all p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon && <span className="text-lg md:text-xl">{category.icon}</span>}
                      <h3 className="font-bold text-white text-sm md:text-base uppercase truncate">{category.name}</h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 mb-2 line-clamp-2">{category.description}</p>
                    <div className="flex gap-4 text-xs md:text-sm">
                      <span className="text-gray-500">
                        Ordre: <span className="text-[#FFBD01] font-semibold">{category.order}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm bg-white/10 hover:bg-white/20 text-[#FFBD01] transition-colors font-medium"
                      title="Éditer"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm bg-white/10 hover:bg-red-500/20 text-[#FF0000] transition-colors font-medium"
                      title="Supprimer"
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
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleModalSubmit}
        category={editingCategory || undefined}
        mode={editingCategory ? 'edit' : 'add'}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la catégorie ?"
        description={`Êtes-vous sûr de vouloir supprimer la catégorie "${deletingCategory?.name}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
