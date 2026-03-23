import { useState } from 'react';
import { useAdminContacts } from '../hooks/useAdminContacts';
import { Mail, Trash2 } from 'lucide-react';
import { ContactReplyModal } from '../components/modals/ContactReplyModal';
import { DeleteConfirmDialog } from '../components/modals/DeleteConfirmDialog';

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

export default function AdminContacts() {
  const { contacts, loading, error, updateContact, deleteContact } = useAdminContacts();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyingContact, setReplyingContact] = useState<ContactSubmission | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<ContactSubmission | null>(null);

  const handleReplyClick = (contact: ContactSubmission) => {
    setReplyingContact(contact);
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async (response: string) => {
    if (replyingContact) {
      await updateContact(replyingContact.id, {
        status: 'replied',
        response,
        responseDate: new Date(),
      });
      setReplyModalOpen(false);
      setReplyingContact(null);
    }
  };

  const handleMarkAsRead = async (contact: ContactSubmission) => {
    if (contact.status === 'new') {
      await updateContact(contact.id, { status: 'read' });
    }
  };

  const handleDeleteClick = (contact: ContactSubmission) => {
    setDeletingContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingContact) {
      await deleteContact(deletingContact.id);
      setIsDeleteDialogOpen(false);
      setDeletingContact(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement des messages...</p>
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

  const filteredContacts = selectedStatus === 'all'
    ? contacts
    : contacts.filter((c) => c.status === selectedStatus);

  const groupedByStatus = {
    new: contacts.filter((c) => c.status === 'new').length,
    read: contacts.filter((c) => c.status === 'read').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Messages de Contact</h1>
        <p className="text-xs md:text-base text-gray-400">Gérez les soumissions de formulaires de contact</p>
      </div>

      {/* Status Tabs - Mobile Horizontal Scroll */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
        {[
          { key: 'all' as const, label: 'Tous', count: contacts.length },
          { key: 'new' as const, label: 'Nouveaux', count: groupedByStatus.new, badge: true },
          { key: 'read' as const, label: 'Lus', count: groupedByStatus.read },
          { key: 'replied' as const, label: 'Répondus', count: groupedByStatus.replied },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedStatus(tab.key)}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedStatus === tab.key
                ? 'bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            {tab.label} {tab.count > 0 && <span className="ml-1 md:ml-2">({tab.count})</span>}
            {tab.badge && groupedByStatus.new > 0 && (
              <span className="ml-1 md:ml-2 inline-block w-2 h-2 bg-[#FF0000] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="p-6 md:p-8 text-center">
            <Mail className="w-10 md:w-12 h-10 md:h-12 text-gray-500 mx-auto mb-3 md:mb-4" />
            <p className="text-sm md:text-base text-gray-400">Aucun message {selectedStatus !== 'all' ? 'dans cette catégorie' : 'pour le moment'}</p>
          </div>
        ) : (
          <div className="w-full space-y-3 md:space-y-4 p-4 md:p-6">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact.id}
                className={`w-full p-4 md:p-6 rounded-3xl border border-white/10 hover:border-[#FFBD01]/50 transition-all ${
                  contact.status === 'new' ? 'bg-[#FFBD01]/5' : 'bg-white/5'
                }`}
              >
                {/* Top Row - Mobile Stacked */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-sm md:text-base truncate">{contact.name}</h3>
                      {contact.status === 'new' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF0000] text-white text-xs font-semibold whitespace-nowrap">NOUVEAU</span>
                      )}
                      {contact.status === 'replied' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#1DB954] text-white text-xs font-semibold whitespace-nowrap">RÉPONDU</span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 truncate">{contact.email}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(contact.timestamp.toDate()).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Subject & Message */}
                <div className="mb-4">
                  <p className="text-xs md:text-sm font-semibold text-[#FFBD01] mb-1">Sujet: {contact.subject}</p>
                  <p className="text-xs md:text-sm text-gray-300 line-clamp-2">{contact.message}</p>
                </div>

                {/* Response (if replied) */}
                {contact.status === 'replied' && contact.response && (
                  <div className="mb-4 p-3 md:p-4 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/30">
                    <p className="text-xs text-[#1DB954] font-semibold mb-1">Votre réponse:</p>
                    <p className="text-xs md:text-sm text-gray-300">{contact.response}</p>
                  </div>
                )}

                {/* Actions - Mobile Stack */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {contact.status === 'new' && (
                    <button
                      onClick={() => handleMarkAsRead(contact)}
                      className="px-3 md:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFBD01] text-xs md:text-sm font-semibold transition-colors"
                    >
                      Marquer comme lu
                    </button>
                  )}
                  {contact.status !== 'replied' && (
                    <button
                      onClick={() => handleReplyClick(contact)}
                      className="px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black text-xs md:text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      Répondre
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(contact)}
                    className="px-3 md:px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-[#FF0000] text-xs md:text-sm font-semibold transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ContactReplyModal
        isOpen={replyModalOpen}
        onClose={() => {
          setReplyModalOpen(false);
          setReplyingContact(null);
        }}
        contact={replyingContact}
        onSubmit={handleReplySubmit}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingContact(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le message ?"
        description={`Êtes-vous sûr de vouloir supprimer le message de "${deletingContact?.name}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
