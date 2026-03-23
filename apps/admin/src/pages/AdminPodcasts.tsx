import { useState } from 'react';
import { useAdminPodcasts } from '../hooks/useAdminPodcasts';
import { Plus } from 'lucide-react';
import { DeleteConfirmDialog } from '../components/modals/DeleteConfirmDialog';

interface Podcast {
  id: string;
  episodeNumber: number;
  title: string;
  guest: string;
  duration: string;
  description: string;
  image?: string;
  audioUrl?: string;
  spotifyLink?: string;
  order: number;
  createdAt: any;
  updatedAt: any;
}

export default function AdminPodcasts() {
  const { podcasts, loading, error, addPodcast, updatePodcast, deletePodcast } = useAdminPodcasts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPodcast, setDeletingPodcast] = useState<Podcast | null>(null);

  const handleAddClick = () => {
    setEditingPodcast(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (podcast: Podcast) => {
    setEditingPodcast(podcast);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (podcast: Podcast) => {
    setDeletingPodcast(podcast);
    setIsDeleteDialogOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Podcast, 'createdAt' | 'updatedAt'>) => {
    if (editingPodcast) {
      await updatePodcast(editingPodcast.id, data);
    } else {
      await addPodcast(data);
    }
    setIsModalOpen(false);
    setEditingPodcast(null);
  };


  const handleDeleteConfirm = async () => {
    if (deletingPodcast) {
      await deletePodcast(deletingPodcast.id);
      setIsDeleteDialogOpen(false);
      setDeletingPodcast(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement des podcasts...</p>
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

  const sortedPodcasts = [...podcasts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Plus récent en premier
  });

  return (
    <div className="w-full space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-start">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Podcasts</h1>
          <p className="text-xs md:text-base text-gray-400">Gérez vos épisodes</p>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-3xl md:rounded-xl bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black text-sm md:text-base font-bold hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Ajouter
        </button>
      </div>

      {/* Podcasts List */}
      <div>
        {sortedPodcasts.length === 0 ? (
          <div className="p-6 md:p-8 rounded bg-white/5 border border-white/10 text-center">
            <p className="text-sm md:text-base text-gray-400">Aucun podcast</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {sortedPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                onClick={() => podcast.spotifyLink && window.open(podcast.spotifyLink, '_blank')}
                className="w-full rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFBD01]/50 transition-all overflow-hidden flex flex-col md:flex-row md:items-stretch cursor-pointer group"
              >
                {/* Image - Left */}
                {podcast.image && (
                  <div className="relative overflow-hidden w-full md:w-48 h-40 md:h-auto bg-black flex-shrink-0">
                    <img
                      src={podcast.image}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Info & Actions */}
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                  {/* Épisode Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white uppercase text-sm md:text-base group-hover:text-[#FFBD01] transition-colors">
                        Episode {podcast.episodeNumber}
                      </h3>
                      <span className="text-xs md:text-sm text-gray-400">{podcast.duration}</span>
                    </div>
                    <p className="font-semibold text-white text-base md:text-lg">{podcast.title}</p>
                    <p className="text-xs md:text-sm text-gray-400">Invité: <span className="text-[#FFBD01]">{podcast.guest}</span></p>
                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{podcast.description}</p>
                  </div>

                  {/* Links & Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between pt-3 border-t border-white/10">
                    <div className="flex gap-2 text-xs">
                      {podcast.spotifyLink && (
                        <a
                          href={podcast.spotifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 rounded bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 transition-colors"
                        >
                          🎵 Spotify
                        </a>
                      )}
                      {podcast.audioUrl && (
                        <a
                          href={podcast.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 rounded bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                        >
                          🎧 Audio
                        </a>
                      )}
                    </div>

                    {/* Edit/Delete */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(podcast);
                        }}
                        className="px-3 md:px-4 py-2 rounded text-xs md:text-sm bg-white/10 hover:bg-white/20 text-[#FFBD01] transition-colors font-medium"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(podcast);
                        }}
                        className="px-3 md:px-4 py-2 rounded text-xs md:text-sm bg-white/10 hover:bg-red-500/20 text-[#FF0000] transition-colors font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 sticky top-0 bg-black">
              <h2 className="text-lg md:text-xl font-bold text-white uppercase">
                {editingPodcast ? 'Éditer' : 'Ajouter'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded transition-colors">
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                const podcastData: any = {
                  id: editingPodcast?.id || '',
                  episodeNumber: parseInt(data.get('episodeNumber') as string) || 0,
                  title: data.get('title') as string,
                  guest: data.get('guest') as string,
                  duration: data.get('duration') as string,
                  description: data.get('description') as string,
                  image: data.get('image') as string,
                  audioUrl: data.get('audioUrl') as string,
                  spotifyLink: data.get('spotifyLink') as string,
                  order: parseInt(data.get('order') as string) || 0,
                  createdAt: editingPodcast?.createdAt,
                  updatedAt: new Date(),
                };
                await handleModalSubmit(podcastData);
              }}
              className="p-4 md:p-6 space-y-4"
            >
              {/* Episode Number */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Numéro Episode</label>
                <input
                  type="number"
                  name="episodeNumber"
                  defaultValue={editingPodcast?.episodeNumber || ''}
                  placeholder="e.g. 1"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Titre</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingPodcast?.title || ''}
                  placeholder="ex: The Art of the DJ"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                  required
                />
              </div>

              {/* Guest */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Invité/Artiste</label>
                <input
                  type="text"
                  name="guest"
                  defaultValue={editingPodcast?.guest || ''}
                  placeholder="ex: DJ Spinall"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Durée</label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={editingPodcast?.duration || ''}
                  placeholder="ex: 45 min"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingPodcast?.description || ''}
                  placeholder="Description de l'épisode..."
                  rows={3}
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors resize-none"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Image URL</label>
                <input
                  type="url"
                  name="image"
                  defaultValue={editingPodcast?.image || ''}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                />
              </div>

              {/* Audio URL */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Audio URL</label>
                <input
                  type="url"
                  name="audioUrl"
                  defaultValue={editingPodcast?.audioUrl || ''}
                  placeholder="https://example.com/episode.mp3"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                />
              </div>

              {/* Spotify Link */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Lien Spotify</label>
                <input
                  type="url"
                  name="spotifyLink"
                  defaultValue={editingPodcast?.spotifyLink || ''}
                  placeholder="https://spotify.com/episode/..."
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 uppercase">Ordre</label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingPodcast?.order || ''}
                  placeholder="1"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 md:gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-base bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-base bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold transition-all"
                >
                  Enregistrer
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
          setDeletingPodcast(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le podcast ?"
        description={`Êtes-vous sûr de vouloir supprimer l'épisode "${deletingPodcast?.title}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
