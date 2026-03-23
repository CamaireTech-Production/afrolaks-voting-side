import { useAdminVotes } from '../hooks/useAdminVotes';
import { useAdminNominees } from '../hooks/useAdminNominees';
import { useAdminCategories } from '../hooks/useAdminCategories';

export default function AdminVotes() {
  const { votes, loading: votesLoading, error: votesError } = useAdminVotes();
  const { nominees, loading: nomineesLoading } = useAdminNominees();
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const loading = votesLoading || nomineesLoading || categoriesLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement des votes...</p>
        </div>
      </div>
    );
  }

  if (votesError) {
    return (
      <div className="p-6 rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/50">
        <h2 className="text-xl font-bold text-[#FF0000] mb-2">Erreur</h2>
        <p className="text-gray-300">{votesError}</p>
      </div>
    );
  }

  // Group votes by nominee and calculate totals
  const votesByNominee: Record<string, number> = {};
  const votesByCategory: Record<string, number> = {};
  let totalVotes = 0;
  let totalValue = 0;

  votes.forEach((vote) => {
    if (vote.paymentStatus === 'completed') {
      votesByNominee[vote.nomineeId] = (votesByNominee[vote.nomineeId] || 0) + vote.voteCount;
      votesByCategory[vote.categoryId] = (votesByCategory[vote.categoryId] || 0) + vote.voteCount;
      totalVotes += vote.voteCount;
      totalValue += vote.amountXAF;
    }
  });

  // Create leaderboard
  const leaderboard = Object.entries(votesByNominee)
    .map(([nomineeId, voteCount]) => ({
      nomineeId,
      nominee: nominees.find((n) => n.id === nomineeId),
      voteCount,
    }))
    .filter((item) => item.nominee)
    .sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="w-full space-y-4 md:space-y-6 px-4 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-4xl font-bold uppercase text-white">Votes & Leaderboard</h1>
        <p className="text-xs md:text-base text-gray-400">Statistiques des votes en temps réel</p>
      </div>

      {/* Stats - Mobile First */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wide mb-2">Total Votes</p>
          <h3 className="text-2xl md:text-4xl font-bold text-[#FFBD01]">{totalVotes}</h3>
        </div>
        <div className="p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wide mb-2">Revenus XAF</p>
          <h3 className="text-xl md:text-3xl font-bold text-[#FF6A01]">{totalValue.toLocaleString()}</h3>
        </div>
        <div className="p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wide mb-2">Catégories</p>
          <h3 className="text-2xl md:text-4xl font-bold text-[#FFBD01]">{Object.keys(votesByCategory).length}</h3>
        </div>
        <div className="p-4 md:p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20">
          <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wide mb-2">Transactions</p>
          <h3 className="text-2xl md:text-4xl font-bold text-[#FF0000]">{votes.length}</h3>
        </div>
      </div>

      {/* Leaderboard - Mobile Cards */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-xl md:text-2xl font-bold uppercase text-white">Classement</h2>
        <div className="bg-white/5 border border-white/10 overflow-hidden">
          {leaderboard.length === 0 ? (
            <div>
              <div className="p-6 md:p-8 text-center">
                <p className="text-sm md:text-base text-gray-400 mb-4">Aucun vote pour le moment</p>
                {Object.keys(votesByNominee).length > 0 && (
                  <div className="mt-4 p-3 md:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-xs text-yellow-600 text-left">
                      Debug: {Object.keys(votesByNominee).length} IDs de nominations trouvés dans les votes, mais 0 correspondances dans la liste des nominations.
                    </p>
                    <p className="text-xs text-gray-500 text-left mt-2">
                      Vote IDs: {Object.keys(votesByNominee).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-400 uppercase">#</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-400 uppercase">Nomination</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-gray-400 uppercase hidden lg:table-cell">Catégorie</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold text-gray-400 uppercase">Votes</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold text-gray-400 uppercase">Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item, index) => (
                    <tr key={item.nomineeId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-[#FFBD01]">#{index + 1}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-white text-sm md:text-base">{item.nominee?.name}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-gray-400 text-sm hidden lg:table-cell">
                        {categories.find((c) => c.id === item.nominee?.categoryId)?.name}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right font-bold text-[#FF6A01]">{item.voteCount}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right text-gray-400 text-sm">
                        {totalVotes > 0 ? `${((item.voteCount / totalVotes) * 100).toFixed(1)}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Card View */}
          {leaderboard.length > 0 && (
            <div className="md:hidden space-y-2">
              {leaderboard.map((item, index) => (
                <div key={item.nomineeId} className="w-full p-3 md:p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#FFBD01] font-bold text-sm">#{index + 1}</span>
                        <h3 className="font-bold text-white text-sm truncate">{item.nominee?.name}</h3>
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {categories.find((c) => c.id === item.nominee?.categoryId)?.name}
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="font-bold text-[#FF6A01]">{item.voteCount}</p>
                      <p className="text-xs text-gray-400">
                        {totalVotes > 0 ? `${((item.voteCount / totalVotes) * 100).toFixed(1)}%` : '0%'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Votes by Category - Mobile First Grid */}
      <div className="w-full space-y-3 md:space-y-4">
        <h2 className="text-xl md:text-2xl font-bold uppercase text-white">Votes par Catégorie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 md:p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFBD01]/50 transition-all">
              <h3 className="font-bold text-white uppercase text-xs md:text-sm mb-3">{category.name}</h3>
              <div className="text-2xl md:text-3xl font-bold text-[#FFBD01]">{votesByCategory[category.id] || 0}</div>
              <p className="text-xs text-gray-500 mt-2">votes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
