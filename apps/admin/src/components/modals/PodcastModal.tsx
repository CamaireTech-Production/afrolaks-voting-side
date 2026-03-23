import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Podcast {
  id: string;
  episodeNumber: number;
  title: string;
  guest: string;
  duration: string;
  description?: string;
  audioUrl?: string;
  spotifyLink?: string;
  order: number;
}

interface PodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Podcast, 'createdAt' | 'updatedAt'>) => Promise<void>;
  podcast?: Podcast;
  mode: 'add' | 'edit';
}

export function PodcastModal({ isOpen, onClose, onSubmit, podcast, mode }: PodcastModalProps) {
  const [episodeNumber, setEpisodeNumber] = useState(0);
  const [title, setTitle] = useState('');
  const [guest, setGuest] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (podcast) {
      setEpisodeNumber(podcast.episodeNumber);
      setTitle(podcast.title);
      setGuest(podcast.guest);
      setDuration(podcast.duration);
      setDescription(podcast.description || '');
      setAudioUrl(podcast.audioUrl || '');
      setSpotifyLink(podcast.spotifyLink || '');
      setOrder(podcast.order);
    } else {
      setEpisodeNumber(0);
      setTitle('');
      setGuest('');
      setDuration('');
      setDescription('');
      setAudioUrl('');
      setSpotifyLink('');
      setOrder(0);
    }
    setError('');
  }, [podcast, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !guest.trim() || !duration.trim() || episodeNumber <= 0) {
      setError('Le numéro d\'épisode, le titre, l\'invité et la durée sont requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: podcast?.id || '',
        episodeNumber,
        title: title.trim(),
        guest: guest.trim(),
        duration: duration.trim(),
        description: description.trim() || undefined,
        audioUrl: audioUrl.trim() || undefined,
        spotifyLink: spotifyLink.trim() || undefined,
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
      <div className="bg-black border border-white/10 rounded-3xl md:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black">
          <h2 className="text-xl font-bold text-white uppercase">
            {mode === 'add' ? 'Ajouter un podcast' : 'Éditer le podcast'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/10 rounded-3xl transition-colors disabled:opacity-50"
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

          {/* Episode Number */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Numéro d'épisode</label>
            <input
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 0)}
              placeholder="ex: 1"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
              min="1"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Afrolaks Episode 1"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
            />
          </div>

          {/* Guest */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Invité</label>
            <input
              type="text"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              placeholder="ex: DJ Spinall"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Durée</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ex: 45 min"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez cet épisode..."
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50 resize-none"
            />
          </div>

          {/* Audio URL */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Lien Audio (optionnel)</label>
            <input
              type="url"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Spotify Link */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Lien Spotify (optionnel)</label>
            <input
              type="url"
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
              placeholder="https://open.spotify.com/episode/..."
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
