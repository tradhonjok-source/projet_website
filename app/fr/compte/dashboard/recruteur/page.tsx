'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import {
  Building2, User, Users, Briefcase, Settings, LogOut, ArrowRight,
  Save, CheckCircle, FileText, Globe, Award, MapPin, Briefcase as BriefcaseIcon,
  Signature, ChevronDown, ChevronUp, PenTool, Eraser, Check,
  Search, Mail, Phone, Star, Crown, AlertCircle
} from 'lucide-react';

interface FormData {
  entrepriseNom: string;
  entrepriseAdresse: string;
  entrepriseVille: string;
  entrepriseProvince: string;
  entrepriseCodePostal: string;
  entrepriseTelephone: string;
  entrepriseEmail: string;
  entrepriseSiteWeb: string;
  entrepriseNE: string;
  lobbyingInscrit: boolean;
  lobbyingNumero: string;
  lobbyingDetails: string;
  recrutementSecteur: string;
  recrutementPostesOuverts: number;
  recrutementSalaires: string;
  recrutementAvantages: string;
  recrutementProcessus: string;
  internationalPays: string;
  internationalPartenaires: string;
  internationalExperience: string;
  permisRequis: boolean;
  permisTypes: string;
  ordreProfessionnel: string;
  ordreNumero: string;
  qcRegion: string;
  qcVillePrimaire: string;
  qcEtablissements: string;
  travailleurNom: string;
  travailleurPrenom: string;
  travailleurEmail: string;
  travailleurTelephone: string;
  travailleurNationalite: string;
  travailleurPasseport: string;
  travailleurFormation: string;
  travailleurExperience: string;
  travailleurCompetences: string;
  travailleurLangues: string;
  declarationAcceptee: boolean;
  declarationNom: string;
  declarationDate: string;
  declarationSignature: string;
}

const defaultFormData: FormData = {
  entrepriseNom: '', entrepriseAdresse: '', entrepriseVille: '', entrepriseProvince: '',
  entrepriseCodePostal: '', entrepriseTelephone: '', entrepriseEmail: '', entrepriseSiteWeb: '', entrepriseNE: '',
  lobbyingInscrit: false, lobbyingNumero: '', lobbyingDetails: '',
  recrutementSecteur: '', recrutementPostesOuverts: 0, recrutementSalaires: '', recrutementAvantages: '', recrutementProcessus: '',
  internationalPays: '', internationalPartenaires: '', internationalExperience: '',
  permisRequis: false, permisTypes: '', ordreProfessionnel: '', ordreNumero: '',
  qcRegion: '', qcVillePrimaire: '', qcEtablissements: '',
  travailleurNom: '', travailleurPrenom: '', travailleurEmail: '', travailleurTelephone: '',
  travailleurNationalite: '', travailleurPasseport: '', travailleurFormation: '',
  travailleurExperience: '', travailleurCompetences: '', travailleurLangues: '',
  declarationAcceptee: false, declarationNom: '', declarationDate: '', declarationSignature: '',
};

interface Subscription {
  plan: 'mensuel' | 'trimestriel' | 'annuel';
  isActive: boolean;
  endDate: string;
  remainingOffres: number;
  totalOffres: number;
}

export default function DashboardRecruteurPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    }>
      <DashboardContent user={user} isLoaded={isLoaded} isSignedIn={isSignedIn} />
    </Suspense>
  );
}

// Composant interne qui utilise searchParams (doit être dans Suspense)
function DashboardContent({ user, isLoaded, isSignedIn }: { user: any; isLoaded: boolean; isSignedIn: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingSub, setIsLoadingSub] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/fr/compte/connexion');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) fetchSubscription();
  }, [isSignedIn]);

  const fetchSubscription = async () => {
    setIsLoadingSub(true);
    try {
      const res = await fetch('/api/recruteur/abonnement');
      const data = await res.json();
      if (data.hasSubscription) setSubscription(data.subscription);
    } catch (e) {
      console.error('Erreur chargement abonnement:', e);
    } finally {
      setIsLoadingSub(false);
    }
  };

  useEffect(() => {
    if (showQuestionnaire && expandedSections[8]) initCanvas();
  }, [showQuestionnaire, expandedSections[8]]);

  const toggleSection = (section: number) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  const handleInputChange = (field: keyof FormData, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const signature = canvas.toDataURL('image/png');
      setSignatureData(signature);
      setFormData(prev => ({ ...prev, declarationSignature: signature }));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
    setFormData(prev => ({ ...prev, declarationSignature: '' }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    if (formData.declarationAcceptee && !signatureData) {
      setSubmitError('Veuillez signer le formulaire avant de soumettre');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/recruteur/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, declarationSignature: signatureData }),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setShowQuestionnaire(false), 2000);
      } else setSubmitError(result.error || 'Erreur lors de la soumission');
    } catch (error) {
      setSubmitError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/fr" className="text-xl font-bold gradient-text">Cabinet DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.firstName || 'Recruteur'}</span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Déconnexion</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Payment success message */}
        {searchParams.get('payment') === 'success' && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Paiement réussi! Votre abonnement est maintenant actif.</span>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-violet-400">Bonjour, {user?.firstName || 'Recruteur'} !</h1>
          <p className="text-muted-foreground">Bienvenue dans votre espace recruteur</p>
        </div>

        {/* Subscription Status Banner */}
        {!isLoadingSub && !subscription && (
          <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Aucun abonnement actif</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pour publier des offres et rechercher des candidats, vous devez souscrire à un forfait.
                </p>
                <Link
                  href="/fr/compte/dashboard/recruteur/abonnement"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all"
                >
                  <Crown className="h-4 w-4" />
                  Choisir un forfait
                </Link>
              </div>
            </div>
          </div>
        )}

        {!isLoadingSub && subscription && (
          <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400">Abonnement {subscription.plan}</h3>
                  <p className="text-sm text-muted-foreground">
                    Actif jusqu'au {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">{subscription.remainingOffres}/{subscription.totalOffres}</p>
                  <p className="text-xs text-muted-foreground">Offres restantes</p>
                </div>
                <Link
                  href="/fr/compte/dashboard/recruteur/abonnement"
                  className="px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-medium"
                >
                  Gérer
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <StatCard icon={Users} label="Candidats vus" value="48" gradient="from-violet-500 to-purple-600" />
          <StatCard icon={Briefcase} label="Offres actives" value={subscription ? `${subscription.remainingOffres}/${subscription.totalOffres}` : "0"} gradient="from-emerald-500 to-teal-600" />
          <StatCard icon={FileText} label="Candidatures reçues" value="12" gradient="from-blue-500 to-cyan-600" />
          <StatCard icon={Star} label="Candidats favoris" value="8" gradient="from-amber-500 to-orange-600" />
        </div>

        {/* Actions principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <ActionCard
            title="Questionnaire Recruteur"
            description="Remplissez le formulaire pour importer un travailleur étranger"
            icon={FileText}
            onClick={() => setShowQuestionnaire(true)}
            gradient="from-violet-500 to-purple-600"
            primary
          />
          <ActionCard
            title="Choisir un forfait"
            description="Sélectionnez votre abonnement pour publier des offres"
            icon={Crown}
            href="/fr/compte/dashboard/recruteur/abonnement"
            gradient="from-amber-500 to-orange-600"
            requiresSubscription={false}
          />
          <ActionCard
            title="Profil Entreprise"
            description="Gérez vos informations"
            icon={Building2}
            href="/fr/compte/profil"
            gradient="from-emerald-500 to-teal-600"
          />
          <ActionCard
            title="Publier une offre"
            description="Créez une nouvelle offre"
            icon={Briefcase}
            href={subscription?.isActive ? "/fr/compte/dashboard/recruteur/offres/nouvelle" : "/fr/compte/dashboard/recruteur/abonnement"}
            gradient="from-blue-500 to-cyan-600"
            requiresSubscription
            hasSubscription={!!subscription?.isActive}
            remainingOffres={subscription?.remainingOffres}
          />
          <ActionCard
            title="Rechercher des candidats"
            description="Trouvez le talent idéal"
            icon={Search}
            href={subscription?.isActive ? "/fr/compte/dashboard/recruteur/candidats" : "/fr/compte/dashboard/recruteur/abonnement"}
            gradient="from-pink-500 to-rose-600"
            requiresSubscription
            hasSubscription={!!subscription?.isActive}
          />
          <ActionCard
            title="Gérer les offres"
            description="Vos offres publiées"
            icon={FileText}
            href={subscription?.isActive ? "/fr/compte/dashboard/recruteur/offres" : "/fr/compte/dashboard/recruteur/abonnement"}
            gradient="from-amber-500 to-orange-600"
            requiresSubscription
            hasSubscription={!!subscription?.isActive}
          />
          <ActionCard
            title="Paramètres"
            description="Gérez votre compte"
            icon={Settings}
            href="/fr/compte/profil"
            gradient="from-slate-500 to-gray-600"
          />
        </div>

        {/* Contact Info */}
        <div className="rounded-2xl border border-border bg-background/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Besoin d'aide ?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Mail className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">contact@cabinetdetie.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Phone className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-xs text-muted-foreground">+1 (514) 980-8001</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <MapPin className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-xs text-muted-foreground">Montréal, QC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire Modal/Section */}
        {showQuestionnaire && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-background rounded-2xl border border-border w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-background">
                <div>
                  <h2 className="text-2xl font-bold text-violet-400">Questionnaire Recruteur</h2>
                  <p className="text-sm text-muted-foreground">8 sections à compléter</p>
                </div>
                <button
                  onClick={() => setShowQuestionnaire(false)}
                  className="p-2 rounded-lg hover:bg-border/10 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {submitSuccess && (
                  <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Questionnaire soumis avec succès!</span>
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 font-medium">{submitError}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Section 1 */}
                  <SectionCard number={1} title="Renseignements sur l'entreprise" icon={Building2} isExpanded={expandedSections[1]} onToggle={() => toggleSection(1)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input label="Nom de l'entreprise" value={formData.entrepriseNom} onChange={(v) => handleInputChange('entrepriseNom', v)} placeholder="Ex: Technologies Avancées Inc." required />
                      <Input label="Numéro d'entreprise (NE)" value={formData.entrepriseNE} onChange={(v) => handleInputChange('entrepriseNE', v)} placeholder="Ex: 123456789" />
                      <Input label="Adresse" value={formData.entrepriseAdresse} onChange={(v) => handleInputChange('entrepriseAdresse', v)} placeholder="Ex: 123 Rue Principale" className="md:col-span-2" />
                      <Input label="Ville" value={formData.entrepriseVille} onChange={(v) => handleInputChange('entrepriseVille', v)} placeholder="Ex: Montréal" />
                      <Input label="Province" value={formData.entrepriseProvince} onChange={(v) => handleInputChange('entrepriseProvince', v)} placeholder="Ex: Québec" />
                      <Input label="Code postal" value={formData.entrepriseCodePostal} onChange={(v) => handleInputChange('entrepriseCodePostal', v)} placeholder="Ex: H1A 1A1" />
                      <Input label="Téléphone" value={formData.entrepriseTelephone} onChange={(v) => handleInputChange('entrepriseTelephone', v)} placeholder="Ex: +1 (514) 123-4567" />
                      <Input label="Email" type="email" value={formData.entrepriseEmail} onChange={(v) => handleInputChange('entrepriseEmail', v)} placeholder="Ex: contact@entreprise.com" />
                      <Input label="Site web" type="url" value={formData.entrepriseSiteWeb} onChange={(v) => handleInputChange('entrepriseSiteWeb', v)} placeholder="Ex: https://www.entreprise.com" className="md:col-span-2" />
                    </div>
                  </SectionCard>

                  {/* Section 2 */}
                  <SectionCard number={2} title="Lobbying" icon={Users} isExpanded={expandedSections[2]} onToggle={() => toggleSection(2)}>
                    <div className="space-y-4">
                      <Checkbox label="Êtes-vous inscrit au registre des lobbyistes?" checked={formData.lobbyingInscrit} onChange={(v) => handleInputChange('lobbyingInscrit', v)} />
                      {formData.lobbyingInscrit && (
                        <>
                          <Input label="Numéro d'inscription" value={formData.lobbyingNumero} onChange={(v) => handleInputChange('lobbyingNumero', v)} placeholder="Ex: L123456" />
                          <Textarea label="Détails du lobbying" value={formData.lobbyingDetails} onChange={(v) => handleInputChange('lobbyingDetails', v)} placeholder="Décrivez vos activités de lobbying..." rows={3} />
                        </>
                      )}
                    </div>
                  </SectionCard>

                  {/* Section 3 */}
                  <SectionCard number={3} title="Recrutement" icon={BriefcaseIcon} isExpanded={expandedSections[3]} onToggle={() => toggleSection(3)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Select label="Secteur d'activité" value={formData.recrutementSecteur} onChange={(v) => handleInputChange('recrutementSecteur', v)} options={[{ value: '', label: 'Sélectionner...' }, { value: 'technologie', label: 'Technologie' }, { value: 'sante', label: 'Santé' }, { value: 'education', label: 'Éducation' }, { value: 'construction', label: 'Construction' }, { value: 'services', label: 'Services' }, { value: 'manufacturier', label: 'Manufacturier' }, { value: 'autre', label: 'Autre' }]} required />
                      <Input label="Nombre de postes ouverts" type="number" value={formData.recrutementPostesOuverts} onChange={(v) => handleInputChange('recrutementPostesOuverts', parseInt(v) || 0)} placeholder="Ex: 5" />
                      <Input label="Échelle salariale" value={formData.recrutementSalaires} onChange={(v) => handleInputChange('recrutementSalaires', v)} placeholder="Ex: 50 000$ - 70 000$ CAD" className="md:col-span-2" />
                      <Textarea label="Avantages sociaux" value={formData.recrutementAvantages} onChange={(v) => handleInputChange('recrutementAvantages', v)} placeholder="Assurance, REER, vacances, etc." rows={3} className="md:col-span-2" />
                      <Textarea label="Processus de recrutement" value={formData.recrutementProcessus} onChange={(v) => handleInputChange('recrutementProcessus', v)} placeholder="Décrivez votre processus de sélection..." rows={4} className="md:col-span-2" />
                    </div>
                  </SectionCard>

                  {/* Section 4 */}
                  <SectionCard number={4} title="Présence Internationale" icon={Globe} isExpanded={expandedSections[4]} onToggle={() => toggleSection(4)}>
                    <div className="space-y-4">
                      <Input label="Pays d'implantation" value={formData.internationalPays} onChange={(v) => handleInputChange('internationalPays', v)} placeholder="Ex: France, Belgique, Sénégal..." />
                      <Textarea label="Partenaires internationaux" value={formData.internationalPartenaires} onChange={(v) => handleInputChange('internationalPartenaires', v)} placeholder="Listez vos partenaires à l'étranger..." rows={3} />
                      <Textarea label="Expérience internationale" value={formData.internationalExperience} onChange={(v) => handleInputChange('internationalExperience', v)} placeholder="Décrivez votre expérience en recrutement international..." rows={4} />
                    </div>
                  </SectionCard>

                  {/* Section 5 */}
                  <SectionCard number={5} title="Permis et Ordre Professionnel" icon={Award} isExpanded={expandedSections[5]} onToggle={() => toggleSection(5)}>
                    <div className="space-y-4">
                      <Checkbox label="Le poste requiert un permis spécial?" checked={formData.permisRequis} onChange={(v) => handleInputChange('permisRequis', v)} />
                      {formData.permisRequis && <Input label="Types de permis requis" value={formData.permisTypes} onChange={(v) => handleInputChange('permisTypes', v)} placeholder="Ex: Permis de conduire, permis de travail..." />}
                      <Input label="Ordre professionnel" value={formData.ordreProfessionnel} onChange={(v) => handleInputChange('ordreProfessionnel', v)} placeholder="Ex: OIQ, OCPQ, etc." />
                      <Input label="Numéro d'ordre" value={formData.ordreNumero} onChange={(v) => handleInputChange('ordreNumero', v)} placeholder="Ex: 12345" />
                    </div>
                  </SectionCard>

                  {/* Section 6 */}
                  <SectionCard number={6} title="Implantation au Québec" icon={MapPin} isExpanded={expandedSections[6]} onToggle={() => toggleSection(6)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Select label="Région du Québec" value={formData.qcRegion} onChange={(v) => handleInputChange('qcRegion', v)} options={[{ value: '', label: 'Sélectionner...' }, { value: 'montreal', label: 'Montréal' }, { value: 'quebec', label: 'Québec' }, { value: 'estrie', label: 'Estrie' }, { value: 'outaouais', label: 'Outaouais' }, { value: 'saguenay', label: 'Saguenay–Lac-Saint-Jean' }, { value: 'autre', label: 'Autre' }]} />
                      <Input label="Ville principale" value={formData.qcVillePrimaire} onChange={(v) => handleInputChange('qcVillePrimaire', v)} placeholder="Ex: Montréal" />
                      <Textarea label="Établissements au Québec" value={formData.qcEtablissements} onChange={(v) => handleInputChange('qcEtablissements', v)} placeholder="Adresse(s) de vos établissements..." rows={3} className="md:col-span-2" />
                    </div>
                  </SectionCard>

                  {/* Section 7 */}
                  <SectionCard number={7} title="Renseignements sur le travailleur étranger" icon={User} isExpanded={expandedSections[7]} onToggle={() => toggleSection(7)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input label="Nom" value={formData.travailleurNom} onChange={(v) => handleInputChange('travailleurNom', v)} placeholder="Ex: Dupont" required />
                      <Input label="Prénom" value={formData.travailleurPrenom} onChange={(v) => handleInputChange('travailleurPrenom', v)} placeholder="Ex: Jean" required />
                      <Input label="Email" type="email" value={formData.travailleurEmail} onChange={(v) => handleInputChange('travailleurEmail', v)} placeholder="Ex: jean.dupont@email.com" />
                      <Input label="Téléphone" value={formData.travailleurTelephone} onChange={(v) => handleInputChange('travailleurTelephone', v)} placeholder="Ex: +33 1 23 45 67 89" />
                      <Input label="Nationalité" value={formData.travailleurNationalite} onChange={(v) => handleInputChange('travailleurNationalite', v)} placeholder="Ex: Française" />
                      <Input label="Numéro de passeport" value={formData.travailleurPasseport} onChange={(v) => handleInputChange('travailleurPasseport', v)} placeholder="Ex: AB1234567" />
                      <Textarea label="Formation" value={formData.travailleurFormation} onChange={(v) => handleInputChange('travailleurFormation', v)} placeholder="Diplômes, certifications..." rows={3} className="md:col-span-2" />
                      <Textarea label="Expérience professionnelle" value={formData.travailleurExperience} onChange={(v) => handleInputChange('travailleurExperience', v)} placeholder="Décrivez l'expérience pertinente..." rows={4} className="md:col-span-2" />
                      <Textarea label="Compétences clés" value={formData.travailleurCompetences} onChange={(v) => handleInputChange('travailleurCompetences', v)} placeholder="Listez les compétences principales..." rows={3} className="md:col-span-2" />
                      <Textarea label="Langues parlées" value={formData.travailleurLangues} onChange={(v) => handleInputChange('travailleurLangues', v)} placeholder="Ex: Français (natif), Anglais (intermédiaire)..." rows={2} className="md:col-span-2" />
                    </div>
                  </SectionCard>

                  {/* Section 8 */}
                  <SectionCard number={8} title="Déclaration et signature électronique" icon={Signature} isExpanded={expandedSections[8]} onToggle={() => toggleSection(8)}>
                    <div className="space-y-4">
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                        <p className="text-sm text-amber-200 mb-2">Je déclare que toutes les informations fournies dans ce formulaire sont exactes et complètes. Je comprends que toute fausse déclaration peut entraîner le refus de ma demande.</p>
                      </div>
                      <Checkbox label="J'accepte et je m'engage" checked={formData.declarationAcceptee} onChange={(v) => handleInputChange('declarationAcceptee', v)} required />
                      {formData.declarationAcceptee && (
                        <>
                          <Input label="Nom complet pour signature" value={formData.declarationNom} onChange={(v) => handleInputChange('declarationNom', v)} placeholder="Votre nom complet" />
                          <Input label="Date" type="date" value={formData.declarationDate} onChange={(v) => handleInputChange('declarationDate', v)} />
                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Signature électronique <span className="text-red-400">*</span></label>
                            <div className="rounded-xl border border-border bg-background/50 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground flex items-center gap-2"><PenTool className="h-4 w-4" />Dessinez votre signature ci-dessous</span>
                                <button type="button" onClick={clearSignature} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"><Eraser className="h-4 w-4" />Effacer</button>
                              </div>
                              <div className="border border-border rounded-lg overflow-hidden bg-white">
                                <canvas ref={canvasRef} width={600} height={200} className="w-full cursor-crosshair touch-none" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                              </div>
                              {signatureData && (<div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm"><Check className="h-4 w-4" />Signature enregistrée</div>)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </SectionCard>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 pt-6">
                    <button onClick={() => setShowQuestionnaire(false)} className="px-6 py-3 rounded-xl border border-border hover:bg-border/10 transition-colors">Annuler</button>
                    <button onClick={handleSubmit} disabled={isSubmitting || !formData.declarationAcceptee} className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      {isSubmitting ? (<><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Soumission...</>) : (<><Save className="h-4 w-4" />Soumettre le questionnaire</>)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}><Icon className="h-5 w-5 text-white" /></div>
        <span className="text-2xl font-bold gradient-text">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ActionCard({ title, description, icon: Icon, href, onClick, gradient, primary, requiresSubscription, hasSubscription, remainingOffres }: any) {
  const isLocked = requiresSubscription && !hasSubscription;
  const isLowCredits = remainingOffres !== undefined && remainingOffres <= 0;

  const content = (
    <div className={`group rounded-2xl border border-border bg-background/50 p-6 transition-all cursor-pointer ${isLocked ? 'opacity-60' : 'hover:border-violet-500/30'}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-1 mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      {isLocked ? (
        <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
          <AlertCircle className="h-4 w-4" />
          Abonnement requis
        </div>
      ) : isLowCredits ? (
        <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
          <AlertCircle className="h-4 w-4" />
          0 offres restantes
        </div>
      ) : (
        <div className={`flex items-center gap-2 text-sm font-medium ${primary ? 'text-violet-400' : 'text-muted-foreground'} group-hover:gap-4 transition-all`}>
          {primary ? 'Commencer' : 'En savoir plus'} <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </div>
  );

  if (isLocked && href) {
    return <Link href={href}>{content}</Link>;
  }
  if (href) return <Link href={href}>{content}</Link>;
  return <div onClick={onClick}>{content}</div>;
}

function SectionCard({ number, title, icon: Icon, isExpanded, onToggle, children }: any) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between hover:bg-border/10 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600"><Icon className="h-5 w-5 text-white" /></div>
          <div className="text-left"><h3 className="text-lg font-semibold">Section {number}: {title}</h3></div>
        </div>
        {isExpanded ? (<ChevronUp className="h-5 w-5 text-muted-foreground" />) : (<ChevronDown className="h-5 w-5 text-muted-foreground" />)}
      </button>
      {isExpanded && (<div className="px-6 pb-6">{children}</div>)}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', required = false, disabled = false, className = '' }: any) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label} {required && <span className="text-red-400">*</span>}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3, className = '' }: any) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none" />
    </div>
  );
}

function Select({ label, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label} {required && <span className="text-red-400">*</span>}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all">
        {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange, required = false }: any) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20" />
      <span className="text-sm">{label} {required && <span className="text-red-400">*</span>}</span>
    </label>
  );
}
