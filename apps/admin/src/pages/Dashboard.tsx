import { useAdminCategories } from '../hooks/useAdminCategories';
import { useAdminNominees } from '../hooks/useAdminNominees';
import { FirestoreDiagnostics } from '../components/FirestoreDiagnostics';

const AdminDashboard = () => {
  const { categories, loading: catLoading, error: catError } = useAdminCategories();
  const { nominees, loading: nomLoading, error: nomError } = useAdminNominees();

  if (catLoading || nomLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (catError || nomError) {
    return (
      <div className="p-6 rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/50">
        <h2 className="text-xl font-bold text-[#FF0000] mb-2">Erreur</h2>
        <p className="text-gray-300">{catError || nomError}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-8 px-4 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="space-y-1 md:space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Dashboard</h1>
        <p className="text-xs md:text-base text-gray-400">Gérez votre plateforme de voting</p>
      </div>

      {/* Stats - Mobile First Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="w-full p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wide mb-1 md:mb-2">Catégories</p>
          <h3 className="text-3xl md:text-4xl font-bold text-[#FFBD01]">{categories.length}</h3>
        </div>
        <div className="w-full p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wide mb-1 md:mb-2">Nominations</p>
          <h3 className="text-3xl md:text-4xl font-bold text-[#FF6A01]">{nominees.length}</h3>
        </div>
        <div className="w-full p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wide mb-1 md:mb-2">Total Votes</p>
          <h3 className="text-3xl md:text-4xl font-bold text-[#FF0000]">
            {nominees.reduce((sum, n) => sum + (n.voteCount || 0), 0)}
          </h3>
        </div>
      </div>

      {/* Diagnostics */}
      <FirestoreDiagnostics />
    </div>
  );
}
export default AdminDashboard;
