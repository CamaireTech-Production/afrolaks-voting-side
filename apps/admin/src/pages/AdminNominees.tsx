import { useState } from 'react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useAdminNominees } from '../hooks/useAdminNominees';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { NomineeModal } from '../components/modals/NomineeModal';
import { DeleteConfirmDialog } from '../components/modals/DeleteConfirmDialog';

interface Nominee {
  id: string;
  name: string;
  image: string;
  categoryId: string;
  voteCount: number;
  order: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export default function AdminNominees() {
  const { categories, loading: catLoading } = useAdminCategories();
  const { nominees, loading: nomLoading, error, addNominee, updateNominee, deleteNominee } = useAdminNominees();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNominee, setDeletingNominee] = useState<Nominee | null>(null);

  const handleAddClick = () => {
    setEditingNominee(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (nominee: Nominee) => {
    setEditingNominee(nominee);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (nominee: Nominee) => {
    console.log('🔴 handleDeleteClick appelé pour:', nominee);
    console.log('   ID:', nominee.id);
    setDeletingNominee(nominee);
    setIsDeleteDialogOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Nominee, 'createdAt' | 'updatedAt' | 'voteCount'>) => {
    const { id, ...dataWithoutId } = data;

    // Utiliser editingNominee pour déterminer si c'est un edit ou un add
    if (editingNominee) {
      // Mode édition: utiliser l'ID de editingNominee
      await updateNominee(editingNominee.id, dataWithoutId);
    } else {
      // Mode création: ajouter un nouveau
      await addNominee(dataWithoutId);
    }
    setIsModalOpen(false);
    setEditingNominee(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingNominee) {
      console.log('✅ handleDeleteConfirm: Suppression de', deletingNominee.id);
      await deleteNominee(deletingNominee.id);
      setIsDeleteDialogOpen(false);
      setDeletingNominee(null);
    }
  };

  const loading = nomLoading || catLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement des nominations...</p>
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

  const filteredNominees = selectedCategoryFilter
    ? nominees.filter((n) => n.categoryId === selectedCategoryFilter)
    : nominees;

  const selectedCategoryName = selectedCategoryFilter
    ? categories.find((c) => c.id === selectedCategoryFilter)?.name
    : null;

  return (
    <div className="w-full space-y-4 px-4 md:px-6 py-4 md:py-6">
      {/* Header - Mobile First */}
      <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Nominations</h1>
          <p className="text-sm md:text-base text-gray-400">Créez, modifiez et supprimez</p>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black text-sm md:text-base font-bold hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Ajouter
        </button>
      </div>

      {/* Filter - Stacked on mobile */}
      <div className="space-y-2">
        <label className="block text-xs md:text-sm font-bold text-gray-300 uppercase">Catégorie</label>
        <div className="flex gap-2">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFBD01] transition-colors"
          >
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {selectedCategoryFilter && (
            <button
              onClick={() => setSelectedCategoryFilter('')}
              className="px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 text-sm transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Nominees Grid - Responsive */}
      <div className="w-full pt-2">
        {filteredNominees.length === 0 ? (
          <div className="p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-sm md:text-base text-gray-400">
              {selectedCategoryFilter
                ? `Aucune dans cette catégorie`
                : 'Aucune nomination'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredNominees.map((nominee) => (
              <div
                key={nominee.id}
                className="w-full rounded-3xl md:rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFBD01]/50 transition-all overflow-hidden group flex flex-col"
              >
                {/* Image - ENLARGED */}
                <div className="relative overflow-hidden h-64 md:h-80 bg-black">
                  <img
                    src={nominee.image}
                    alt={nominee.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3C/svg%3E';
                    }}
                  />
                  {!nominee.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs md:text-sm font-bold">Inactif</span>
                    </div>
                  )}
                </div>

                {/* Content - REDUCED */}
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-white uppercase text-sm md:text-base mb-2">{nominee.name}</h3>

                  {/* Vote Stats */}
                  <div className="mb-3 p-2 rounded bg-white/5">
                    <span className="text-[#FFBD01] font-bold">{nominee.voteCount || 0}</span>
                    <span className="text-xs text-gray-500 ml-2">votes</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(nominee)}
                      className="flex-1 px-2 py-2 rounded text-xs bg-white/10 hover:bg-white/20 text-[#FFBD01] transition-colors font-medium"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDeleteClick(nominee)}
                      className="flex-1 px-2 py-2 rounded text-xs bg-white/10 hover:bg-red-500/20 text-[#FF0000] transition-colors font-medium"
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
      <NomineeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNominee(null);
        }}
        onSubmit={handleModalSubmit}
        nominee={editingNominee || undefined}
        mode={editingNominee ? 'edit' : 'add'}
        categories={categories}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingNominee(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer ?"
        description={`Confirmer la suppression de "${deletingNominee?.name}" ?`}
      />
    </div>
  );
}
