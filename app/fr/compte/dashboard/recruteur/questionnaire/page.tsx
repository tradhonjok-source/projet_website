'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Building2, User, Users, Briefcase, Settings, LogOut, ArrowRight,
  Save, CheckCircle, FileText, Globe, Award, MapPin, Briefcase as BriefcaseIcon,
  GraduationCap, FileCheck, Signature, Upload, ChevronDown, ChevronUp,
  PenTool, Eraser, Check
} from 'lucide-react';

interface FormData {
  // Section 1: Renseignements entreprise
  entrepriseNom: string;
  entrepriseAdresse: string;
  entrepriseVille: string;
  entrepriseProvince: string;
  entrepriseCodePostal: string;
  entrepriseTelephone: string;
  entrepriseEmail: string;
  entrepriseSiteWeb: string;
  entrepriseNE: string; // Numéro d'entreprise

  // Section 2: Lobbying
  lobbyingInscrit: boolean;
  lobbyingNumero: string;
  lobbyingDetails: string;

  // Section 3: Recrutement
  recrutementSecteur: string;
  recrutementPostesOuverts: number;
  recrutementSalaires: string;
  recrutementAvantages: string;
  recrutementProcessus: string;

  // Section 4: Monde/International
  internationalPays: string;
  internationalPartenaires: string;
  internationalExperience: string;

  // Section 5: Permis/Ordre
  permisRequis: boolean;
  permisTypes: string;
  ordreProfessionnel: string;
  ordreNumero: string;

  // Section 6: Québec
  qcRegion: string;
  qcVillePrimaire: string;
  qcEtablissements: string;

  // Section 7: Travailleur étranger
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

  // Section 8: Déclaration
  declarationAcceptee: boolean;
  declarationNom: string;
  declarationDate: string;
  declarationSignature: string; // Signature électronique (dataURL)
}

const defaultFormData: FormData = {
  entrepriseNom: '',
  entrepriseAdresse: '',
  entrepriseVille: '',
  entrepriseProvince: '',
  entrepriseCodePostal: '',
  entrepriseTelephone: '',
  entrepriseEmail: '',
  entrepriseSiteWeb: '',
  entrepriseNE: '',

  lobbyingInscrit: false,
  lobbyingNumero: '',
  lobbyingDetails: '',

  recrutementSecteur: '',
  recrutementPostesOuverts: 0,
  recrutementSalaires: '',
  recrutementAvantages: '',
  recrutementProcessus: '',

  internationalPays: '',
  internationalPartenaires: '',
  internationalExperience: '',

  permisRequis: false,
  permisTypes: '',
  ordreProfessionnel: '',
  ordreNumero: '',

  qcRegion: '',
  qcVillePrimaire: '',
  qcEtablissements: '',

  travailleurNom: '',
  travailleurPrenom: '',
  travailleurEmail: '',
  travailleurTelephone: '',
  travailleurNationalite: '',
  travailleurPasseport: '',
  travailleurFormation: '',
  travailleurExperience: '',
  travailleurCompetences: '',
  travailleurLangues: '',

  declarationAcceptee: false,
  declarationNom: '',
  declarationDate: '',
  declarationSignature: '',
};

export default function QuestionnaireRecruteurPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false
  });
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  // Initialiser le canvas quand la section 8 est expandue
  useEffect(() => {
    if (expandedSections[8]) {
      initCanvas();
    }
  }, [expandedSections[8]]);

  const toggleSection = (section: number) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Signature électronique fonctions
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fond blanc pour éviter la transparence
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
    setSignatureData('');
    setFormData(prev => ({ ...prev, declarationSignature: '' }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Validation complète de tous les champs obligatoires
    const errors: string[] = [];

    // Section 1: Entreprise
    if (!formData.entrepriseNom.trim()) errors.push('Le nom de l\'entreprise est requis');
    if (!formData.entrepriseAdresse.trim()) errors.push('L\'adresse de l\'entreprise est requise');
    if (!formData.entrepriseVille.trim()) errors.push('La ville de l\'entreprise est requise');
    if (!formData.entrepriseProvince.trim()) errors.push('La province de l\'entreprise est requise');
    if (!formData.entrepriseCodePostal.trim()) errors.push('Le code postal de l\'entreprise est requis');
    if (!formData.entrepriseTelephone.trim()) errors.push('Le téléphone de l\'entreprise est requis');
    if (!formData.entrepriseEmail.trim()) errors.push('L\'email de l\'entreprise est requis');
    if (!formData.entrepriseSiteWeb.trim()) errors.push('Le site web de l\'entreprise est requis');
    if (!formData.entrepriseNE.trim()) errors.push('Le numéro d\'entreprise est requis');

    // Section 2: Lobbying (si inscrit)
    if (formData.lobbyingInscrit) {
      if (!formData.lobbyingNumero.trim()) errors.push('Le numéro d\'inscription au lobbying est requis');
      if (!formData.lobbyingDetails.trim()) errors.push('Les détails du lobbying sont requis');
    }

    // Section 3: Recrutement
    if (!formData.recrutementSecteur.trim()) errors.push('Le secteur d\'activité est requis');
    if (!formData.recrutementPostesOuverts || formData.recrutementPostesOuverts <= 0) errors.push('Le nombre de postes ouverts est requis');
    if (!formData.recrutementSalaires.trim()) errors.push('L\'échelle salariale est requise');
    if (!formData.recrutementAvantages.trim()) errors.push('Les avantages sociaux sont requis');
    if (!formData.recrutementProcessus.trim()) errors.push('Le processus de recrutement est requis');

    // Section 4: International
    if (!formData.internationalPays.trim()) errors.push('Le pays d\'implantation est requis');
    if (!formData.internationalPartenaires.trim()) errors.push('Les partenaires internationaux sont requis');
    if (!formData.internationalExperience.trim()) errors.push('L\'expérience internationale est requise');

    // Section 5: Permis/Ordre
    if (formData.permisRequis && !formData.permisTypes.trim()) errors.push('Les types de permis sont requis');
    if (!formData.ordreProfessionnel.trim()) errors.push('L\'ordre professionnel est requis');
    if (!formData.ordreNumero.trim()) errors.push('Le numéro d\'ordre est requis');

    // Section 6: Québec
    if (!formData.qcRegion.trim()) errors.push('La région du Québec est requise');
    if (!formData.qcVillePrimaire.trim()) errors.push('La ville principale est requise');
    if (!formData.qcEtablissements.trim()) errors.push('Les établissements au Québec sont requis');

    // Section 7: Travailleur étranger
    if (!formData.travailleurNom.trim()) errors.push('Le nom du travailleur est requis');
    if (!formData.travailleurPrenom.trim()) errors.push('Le prénom du travailleur est requis');
    if (!formData.travailleurEmail.trim()) errors.push('L\'email du travailleur est requis');
    if (!formData.travailleurTelephone.trim()) errors.push('Le téléphone du travailleur est requis');
    if (!formData.travailleurNationalite.trim()) errors.push('La nationalité du travailleur est requise');
    if (!formData.travailleurPasseport.trim()) errors.push('Le numéro de passeport est requis');
    if (!formData.travailleurFormation.trim()) errors.push('La formation du travailleur est requise');
    if (!formData.travailleurExperience.trim()) errors.push('L\'expérience du travailleur est requise');
    if (!formData.travailleurCompetences.trim()) errors.push('Les compétences du travailleur sont requises');
    if (!formData.travailleurLangues.trim()) errors.push('Les langues parlées sont requises');

    // Section 8: Déclaration
    if (!formData.declarationAcceptee) errors.push('Vous devez accepter la déclaration');
    if (!formData.declarationNom.trim()) errors.push('Le nom pour la signature est requis');
    if (!formData.declarationDate.trim()) errors.push('La date est requise');
    if (!formData.declarationAcceptee && !signatureData) errors.push('La signature électronique est requise');
    if (formData.declarationAcceptee && !signatureData) errors.push('La signature électronique est requise');

    if (errors.length > 0) {
      setSubmitError('Veuillez remplir tous les champs obligatoires :\n• ' + errors.join('\n• '));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/recruteur/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          declarationSignature: signatureData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push('/fr/compte/dashboard/recruteur');
        }, 2000);
      } else {
        // Afficher l'erreur détaillée si disponible
        const errorMessage = result.details
          ? `${result.error} - ${result.details}`
          : (result.error || 'Erreur lors de la soumission');
        setSubmitError(errorMessage);
      }
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
          <Link href="/fr" className="text-xl font-bold gradient-text">
            Cabinet DETIE
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.firstName || 'Recruteur'}
            </span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-violet-400">
            Questionnaire Recruteur
          </h1>
          <p className="text-muted-foreground">
            Veuillez remplir toutes les sections pour compléter votre profil
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">
              Questionnaire soumis avec succès! Redirection en cours...
            </span>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">{submitError}</span>
          </div>
        )}

        {/* Form Sections */}
        <div className="space-y-6 max-w-4xl mx-auto">

          {/* Section 1: Renseignements entreprise */}
          <SectionCard
            number={1}
            title="Renseignements sur l'entreprise"
            icon={Building2}
            isExpanded={expandedSections[1]}
            onToggle={() => toggleSection(1)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nom de l'entreprise"
                value={formData.entrepriseNom}
                onChange={(v) => handleInputChange('entrepriseNom', v)}
                placeholder="Ex: Technologies Avancées Inc."
                required
              />
              <Input
                label="Numéro d'entreprise (NE)"
                value={formData.entrepriseNE}
                onChange={(v) => handleInputChange('entrepriseNE', v)}
                placeholder="Ex: 123456789"
              />
              <Input
                label="Adresse"
                value={formData.entrepriseAdresse}
                onChange={(v) => handleInputChange('entrepriseAdresse', v)}
                placeholder="Ex: 123 Rue Principale"
                className="md:col-span-2"
              />
              <Input
                label="Ville"
                value={formData.entrepriseVille}
                onChange={(v) => handleInputChange('entrepriseVille', v)}
                placeholder="Ex: Montréal"
              />
              <Input
                label="Province"
                value={formData.entrepriseProvince}
                onChange={(v) => handleInputChange('entrepriseProvince', v)}
                placeholder="Ex: Québec"
              />
              <Input
                label="Code postal"
                value={formData.entrepriseCodePostal}
                onChange={(v) => handleInputChange('entrepriseCodePostal', v)}
                placeholder="Ex: H1A 1A1"
              />
              <Input
                label="Téléphone"
                value={formData.entrepriseTelephone}
                onChange={(v) => handleInputChange('entrepriseTelephone', v)}
                placeholder="Ex: +1 (514) 123-4567"
              />
              <Input
                label="Email"
                type="email"
                value={formData.entrepriseEmail}
                onChange={(v) => handleInputChange('entrepriseEmail', v)}
                placeholder="Ex: contact@entreprise.com"
              />
              <Input
                label="Site web"
                type="url"
                value={formData.entrepriseSiteWeb}
                onChange={(v) => handleInputChange('entrepriseSiteWeb', v)}
                placeholder="Ex: https://www.entreprise.com"
                className="md:col-span-2"
              />
            </div>
          </SectionCard>

          {/* Section 2: Lobbying */}
          <SectionCard
            number={2}
            title="Lobbying"
            icon={Users}
            isExpanded={expandedSections[2]}
            onToggle={() => toggleSection(2)}
          >
            <div className="space-y-4">
              <Checkbox
                label="Êtes-vous inscrit au registre des lobbyistes?"
                checked={formData.lobbyingInscrit}
                onChange={(v) => handleInputChange('lobbyingInscrit', v)}
              />
              {formData.lobbyingInscrit && (
                <>
                  <Input
                    label="Numéro d'inscription"
                    value={formData.lobbyingNumero}
                    onChange={(v) => handleInputChange('lobbyingNumero', v)}
                    placeholder="Ex: L123456"
                  />
                  <Textarea
                    label="Détails du lobbying"
                    value={formData.lobbyingDetails}
                    onChange={(v) => handleInputChange('lobbyingDetails', v)}
                    placeholder="Décrivez vos activités de lobbying..."
                    rows={3}
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* Section 3: Recrutement */}
          <SectionCard
            number={3}
            title="Recrutement"
            icon={BriefcaseIcon}
            isExpanded={expandedSections[3]}
            onToggle={() => toggleSection(3)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Secteur d'activité"
                value={formData.recrutementSecteur}
                onChange={(v) => handleInputChange('recrutementSecteur', v)}
                options={[
                  { value: '', label: 'Sélectionner...' },
                  { value: 'technologie', label: 'Technologie' },
                  { value: 'sante', label: 'Santé' },
                  { value: 'education', label: 'Éducation' },
                  { value: 'construction', label: 'Construction' },
                  { value: 'services', label: 'Services' },
                  { value: 'manufacturier', label: 'Manufacturier' },
                  { value: 'autre', label: 'Autre' },
                ]}
                required
              />
              <Input
                label="Nombre de postes ouverts"
                type="number"
                value={formData.recrutementPostesOuverts}
                onChange={(v) => handleInputChange('recrutementPostesOuverts', parseInt(v) || 0)}
                placeholder="Ex: 5"
              />
              <Input
                label="Échelle salariale"
                value={formData.recrutementSalaires}
                onChange={(v) => handleInputChange('recrutementSalaires', v)}
                placeholder="Ex: 50 000$ - 70 000$ CAD"
                className="md:col-span-2"
              />
              <Textarea
                label="Avantages sociaux"
                value={formData.recrutementAvantages}
                onChange={(v) => handleInputChange('recrutementAvantages', v)}
                placeholder="Assurance, REER, vacances, etc."
                rows={3}
                className="md:col-span-2"
              />
              <Textarea
                label="Processus de recrutement"
                value={formData.recrutementProcessus}
                onChange={(v) => handleInputChange('recrutementProcessus', v)}
                placeholder="Décrivez votre processus de sélection..."
                rows={4}
                className="md:col-span-2"
              />
            </div>
          </SectionCard>

          {/* Section 4: Monde/International */}
          <SectionCard
            number={4}
            title="Présence Internationale"
            icon={Globe}
            isExpanded={expandedSections[4]}
            onToggle={() => toggleSection(4)}
          >
            <div className="space-y-4">
              <Input
                label="Pays d'implantation"
                value={formData.internationalPays}
                onChange={(v) => handleInputChange('internationalPays', v)}
                placeholder="Ex: France, Belgique, Sénégal..."
              />
              <Textarea
                label="Partenaires internationaux"
                value={formData.internationalPartenaires}
                onChange={(v) => handleInputChange('internationalPartenaires', v)}
                placeholder="Listez vos partenaires à l'étranger..."
                rows={3}
              />
              <Textarea
                label="Expérience internationale"
                value={formData.internationalExperience}
                onChange={(v) => handleInputChange('internationalExperience', v)}
                placeholder="Décrivez votre expérience en recrutement international..."
                rows={4}
              />
            </div>
          </SectionCard>

          {/* Section 5: Permis/Ordre professionnel */}
          <SectionCard
            number={5}
            title="Permis et Ordre Professionnel"
            icon={Award}
            isExpanded={expandedSections[5]}
            onToggle={() => toggleSection(5)}
          >
            <div className="space-y-4">
              <Checkbox
                label="Le poste requiert un permis spécial?"
                checked={formData.permisRequis}
                onChange={(v) => handleInputChange('permisRequis', v)}
              />
              {formData.permisRequis && (
                <Input
                  label="Types de permis requis"
                  value={formData.permisTypes}
                  onChange={(v) => handleInputChange('permisTypes', v)}
                  placeholder="Ex: Permis de conduire, permis de travail..."
                />
              )}
              <Input
                label="Ordre professionnel"
                value={formData.ordreProfessionnel}
                onChange={(v) => handleInputChange('ordreProfessionnel', v)}
                placeholder="Ex: OIQ, OCPQ, etc."
              />
              <Input
                label="Numéro d'ordre"
                value={formData.ordreNumero}
                onChange={(v) => handleInputChange('ordreNumero', v)}
                placeholder="Ex: 12345"
              />
            </div>
          </SectionCard>

          {/* Section 6: Québec */}
          <SectionCard
            number={6}
            title="Implantation au Québec"
            icon={MapPin}
            isExpanded={expandedSections[6]}
            onToggle={() => toggleSection(6)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Région du Québec"
                value={formData.qcRegion}
                onChange={(v) => handleInputChange('qcRegion', v)}
                options={[
                  { value: '', label: 'Sélectionner...' },
                  { value: 'montreal', label: 'Montréal' },
                  { value: 'quebec', label: 'Québec' },
                  { value: 'estrie', label: 'Estrie' },
                  { value: 'outaouais', label: 'Outaouais' },
                  { value: 'saguenay', label: 'Saguenay–Lac-Saint-Jean' },
                  { value: 'autre', label: 'Autre' },
                ]}
              />
              <Input
                label="Ville principale"
                value={formData.qcVillePrimaire}
                onChange={(v) => handleInputChange('qcVillePrimaire', v)}
                placeholder="Ex: Montréal"
              />
              <Textarea
                label="Établissements au Québec"
                value={formData.qcEtablissements}
                onChange={(v) => handleInputChange('qcEtablissements', v)}
                placeholder="Adresse(s) de vos établissements..."
                rows={3}
                className="md:col-span-2"
              />
            </div>
          </SectionCard>

          {/* Section 7: Travailleur étranger */}
          <SectionCard
            number={7}
            title="Renseignements sur le travailleur étranger"
            icon={User}
            isExpanded={expandedSections[7]}
            onToggle={() => toggleSection(7)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nom"
                value={formData.travailleurNom}
                onChange={(v) => handleInputChange('travailleurNom', v)}
                placeholder="Ex: Dupont"
                required
              />
              <Input
                label="Prénom"
                value={formData.travailleurPrenom}
                onChange={(v) => handleInputChange('travailleurPrenom', v)}
                placeholder="Ex: Jean"
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.travailleurEmail}
                onChange={(v) => handleInputChange('travailleurEmail', v)}
                placeholder="Ex: jean.dupont@email.com"
              />
              <Input
                label="Téléphone"
                value={formData.travailleurTelephone}
                onChange={(v) => handleInputChange('travailleurTelephone', v)}
                placeholder="Ex: +33 1 23 45 67 89"
              />
              <Input
                label="Nationalité"
                value={formData.travailleurNationalite}
                onChange={(v) => handleInputChange('travailleurNationalite', v)}
                placeholder="Ex: Française"
              />
              <Input
                label="Numéro de passeport"
                value={formData.travailleurPasseport}
                onChange={(v) => handleInputChange('travailleurPasseport', v)}
                placeholder="Ex: AB1234567"
              />
              <Textarea
                label="Formation"
                value={formData.travailleurFormation}
                onChange={(v) => handleInputChange('travailleurFormation', v)}
                placeholder="Diplômes, certifications..."
                rows={3}
                className="md:col-span-2"
              />
              <Textarea
                label="Expérience professionnelle"
                value={formData.travailleurExperience}
                onChange={(v) => handleInputChange('travailleurExperience', v)}
                placeholder="Décrivez l'expérience pertinente..."
                rows={4}
                className="md:col-span-2"
              />
              <Textarea
                label="Compétences clés"
                value={formData.travailleurCompetences}
                onChange={(v) => handleInputChange('travailleurCompetences', v)}
                placeholder="Listez les compétences principales..."
                rows={3}
                className="md:col-span-2"
              />
              <Textarea
                label="Langues parlées"
                value={formData.travailleurLangues}
                onChange={(v) => handleInputChange('travailleurLangues', v)}
                placeholder="Ex: Français (natif), Anglais (intermédiaire)..."
                rows={2}
                className="md:col-span-2"
              />
            </div>
          </SectionCard>

          {/* Section 8: Déclaration */}
          <SectionCard
            number={8}
            title="Déclaration et signature électronique"
            icon={Signature}
            isExpanded={expandedSections[8]}
            onToggle={() => toggleSection(8)}
          >
            <div className="space-y-4">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <p className="text-sm text-amber-200 mb-2">
                  Je déclare que toutes les informations fournies dans ce formulaire sont exactes et complètes.
                  Je comprends que toute fausse déclaration peut entraîner le refus de ma demande.
                </p>
              </div>
              <Checkbox
                label="J'accepte et je m'engage"
                checked={formData.declarationAcceptee}
                onChange={(v) => handleInputChange('declarationAcceptee', v)}
                required
              />
              {formData.declarationAcceptee && (
                <>
                  <Input
                    label="Nom complet pour signature"
                    value={formData.declarationNom}
                    onChange={(v) => handleInputChange('declarationNom', v)}
                    placeholder="Votre nom complet"
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={formData.declarationDate}
                    onChange={(v) => handleInputChange('declarationDate', v)}
                  />

                  {/* Signature électronique */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Signature électronique <span className="text-red-400">*</span>
                    </label>
                    <div className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <PenTool className="h-4 w-4" />
                          Dessinez votre signature ci-dessous
                        </span>
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Eraser className="h-4 w-4" />
                          Effacer
                        </button>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden bg-white">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={200}
                          className="w-full cursor-crosshair touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                      </div>
                      {signatureData && (
                        <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                          <Check className="h-4 w-4" />
                          Signature enregistrée
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <Link
              href="/fr/compte/dashboard/recruteur"
              className="px-6 py-3 rounded-xl border border-border hover:bg-border/10 transition-colors"
            >
              Annuler
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.declarationAcceptee}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium
                         hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Soumission...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Soumettre le questionnaire
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Components
function SectionCard({ number, title, icon: Icon, isExpanded, onToggle, children }: any) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-border/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">Section {number}: {title}</h3>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text', required = false, disabled = false, className = '' }: any) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                   outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3, className = '' }: any) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                   outline-none transition-all resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                   outline-none transition-all"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange, required = false }: any) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-border text-violet-500 focus:ring-violet-500/20"
      />
      <span className="text-sm">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
    </label>
  );
}
