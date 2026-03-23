import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: any;
  status: 'new' | 'read' | 'replied';
  response?: string;
  responseDate?: any;
}

interface ContactReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactSubmission | null;
  onSubmit: (response: string) => Promise<void>;
}

export function ContactReplyModal({
  isOpen,
  onClose,
  contact,
  onSubmit,
}: ContactReplyModalProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setResponse('');
    setError('');
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!response.trim()) {
      setError('Le message de réponse ne peut pas être vide');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(response.trim());
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/10 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black">
          <h2 className="text-xl font-bold text-white uppercase">
            Répondre à {contact.name}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Original Message */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Message original</p>
            <h3 className="font-bold text-white mb-2">Sujet: {contact.subject}</h3>
            <p className="text-sm text-gray-300">{contact.message}</p>
            <p className="text-xs text-gray-500 mt-3">
              De: <span className="text-[#FFBD01]">{contact.email}</span>
            </p>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-[#FF0000]/20 border border-[#FF0000]/50">
                <p className="text-[#FF0000] text-sm font-semibold">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Votre réponse</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                disabled={isSubmitting}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors disabled:opacity-50 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-2">{response.length} caractères</p>
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
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la réponse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
