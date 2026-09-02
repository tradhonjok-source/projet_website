'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter,
  UserCheck, Loader2
} from 'lucide-react';

interface Candidate {
  id: string;
  clerkUserId: string;
  email: string;
  nomFamille: string | null;
  prenom: string | null;
  telephone: string | null;
  lieuNaissancePays: string | null;
  adresseVille: string | null;
  adressePays: string | null;
  statutImmigration: string | null;
  createdAt: string;
  isValidated: boolean;
  validatedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  userEmail: string;
}

interface CandidatesResponse {
  candidates: Candidate[];
}

type FilterStatus = 'all' | 'pending' | 'validated' | 'rejected';

export default function AdminCandidatesPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/en/compte/connexion');
      return;
    }

    if (isLoaded && isSignedIn && user) {
      const role = user.publicMetadata?.role as string;
      if (role !== 'admin') {
        router.push('/en/compte/dashboard/candidat');
        return;
      }
    }

    if (isLoaded && isSignedIn && user?.publicMetadata?.role === 'admin') {
      loadCandidates();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';
      const response = await fetch('/api/admin/candidats', {
        headers: {
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error loading candidates');
      }

      const data: CandidatesResponse = await response.json();
      setCandidates(data.candidates);
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError((err as Error).message || 'Error loading candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (candidateId: string) => {
    setActionLoading(true);
    try {
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';
      const response = await fetch('/api/admin/candidats/valider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          candidateId,
          action: 'validate',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error validating');
      }

      setCandidates(prev =>
        prev.map(c =>
          c.id === candidateId
            ? { ...c, isValidated: true, validatedAt: new Date().toISOString(), rejectedAt: null, rejectionReason: null }
            : c
        )
      );

      alert('Candidate validated successfully');
    } catch (err) {
      console.error('Error validating:', err);
      alert('Error validating: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCandidate) return;

    setActionLoading(true);
    try {
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';
      const response = await fetch('/api/admin/candidats/valider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          action: 'reject',
          reason: rejectionReason || 'No reason provided',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error rejecting');
      }

      setCandidates(prev =>
        prev.map(c =>
          c.id === selectedCandidate.id
            ? { ...c, isValidated: false, rejectedAt: new Date().toISOString(), rejectedBy: user?.id, rejectionReason: rejectionReason || 'No reason provided' }
            : c
        )
      );

      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedCandidate(null);
      alert('Candidate rejected');
    } catch (err) {
      console.error('Error rejecting:', err);
      alert('Error rejecting: ' + (err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setRejectionReason(candidate.rejectionReason || '');
    setShowRejectModal(true);
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filterStatus === 'pending' && (candidate.isValidated || candidate.rejectedAt)) return false;
    if (filterStatus === 'validated' && !candidate.isValidated) return false;
    if (filterStatus === 'rejected' && !candidate.rejectedAt) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.nomFamille?.toLowerCase().includes(searchLower) ||
      candidate.prenom?.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower) ||
      candidate.lieuNaissancePays?.toLowerCase().includes(searchLower) ||
      candidate.adresseVille?.toLowerCase().includes(searchLower)
    );
  });

  const pendingCount = candidates.filter(c => !c.isValidated && !c.rejectedAt).length;
  const validatedCount = candidates.filter(c => c.isValidated).length;
  const rejectedCount = candidates.filter(c => c.rejectedAt).length;

  if (!isLoaded || (isLoaded && isSignedIn && user?.publicMetadata?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950/30 via-background to-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/en/admin"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to admin
          </Link>
          <button
            onClick={loadCandidates}
            className="text-sm text-amber-400 hover:text-amber-300"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-amber-400">
            Candidate Management
          </h1>
          <p className="text-muted-foreground">
            Validate or reject submitted applications
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-500/5 border border-slate-500/20 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-slate-400" />
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold">{validatedCount}</div>
                <div className="text-sm text-muted-foreground">Validated</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold">{rejectedCount}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-amber-400" />
              <div>
                <div className="text-2xl font-bold">{candidates.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-slate-500 text-white'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-1" />
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('validated')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'validated'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <CheckCircle className="h-4 w-4 inline mr-1" />
              Validated ({validatedCount})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <XCircle className="h-4 w-4 inline mr-1" />
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div>
              <div className="font-medium text-red-400">Error</div>
              <div className="text-sm text-red-400/80">{error}</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            <span className="ml-3 text-muted-foreground">Loading candidates...</span>
          </div>
        )}

        {!loading && filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No candidates found</p>
          </div>
        )}

        {!loading && filteredCandidates.length > 0 && (
          <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Candidate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {candidate.prenom} {candidate.nomFamille}
                        </div>
                        <div className="text-xs text-muted-foreground">{candidate.userEmail}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">{candidate.email}</div>
                        {candidate.telephone && (
                          <div className="text-xs text-muted-foreground">{candidate.telephone}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          {candidate.adresseVille}, {candidate.adressePays}
                        </div>
                        {candidate.lieuNaissancePays && (
                          <div className="text-xs text-muted-foreground">
                            Born in {candidate.lieuNaissancePays}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {candidate.isValidated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <CheckCircle className="h-3 w-3" />
                            Validated
                          </span>
                        ) : candidate.rejectedAt ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {new Date(candidate.createdAt).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!candidate.isValidated && !candidate.rejectedAt && (
                            <>
                              <button
                                onClick={() => handleValidate(candidate.id)}
                                disabled={actionLoading}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                title="Validate"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openRejectModal(candidate)}
                                disabled={actionLoading}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {candidate.isValidated && (
                            <span className="text-xs text-muted-foreground">
                              Validated on {candidate.validatedAt ? new Date(candidate.validatedAt).toLocaleDateString('en-US') : ''}
                            </span>
                          )}
                          {candidate.rejectedAt && (
                            <span className="text-xs text-muted-foreground">
                              Rejected on {new Date(candidate.rejectedAt).toLocaleDateString('en-US')}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-background border border-border p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold">Reject this candidate</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting the application of{' '}
              <span className="font-medium">{selectedCandidate?.prenom} {selectedCandidate?.nomFamille}</span>
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedCandidate(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
