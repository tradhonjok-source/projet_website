'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Save, Upload, CheckCircle, AlertCircle, LogOut, PenTool, X, CheckCircle2
} from 'lucide-react';

interface Study {
  etablissement: string;
  pays: string;
  diplome: string;
  domaine: string;
  dateDebut: string;
  dateFin: string;
}

interface Experience {
  entreprise: string;
  ville: string;
  pays: string;
  poste: string;
  heuresSemaine: string;
  dateDebut: string;
  dateFin: string;
  taches: string;
}

export default function ProfilCandidatPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Section 1: Renseignements personnels
  const [personalInfo, setPersonalInfo] = useState({
    nomFamille: '',
    prenom: '',
    dateNaissance: '',
    numeroPasseport: '',
    passeportDateDebut: '',
    passeportDateFin: '',
    lieuNaissanceVille: '',
    lieuNaissanceProvince: '',
    lieuNaissancePays: '',
    adresseNumero: '',
    adresseRue: '',
    adresseAppartement: '',
    adresseVille: '',
    adresseProvince: '',
    adresseCodePostal: '',
    adressePays: '',
    telephone: '',
    email: '',
    resideQuebec: '',
    statutImmigration: '',
    controleEntreprise: '',
    controleEntrepriseDetails: '',
  });

  // Section 2: Études (5 entrées max)
  const [studies, setStudies] = useState<Study[]>([
    { etablissement: '', pays: '', diplome: '', domaine: '', dateDebut: '', dateFin: '' }
  ]);

  // Section 3: Expériences professionnelles (5 entrées max)
  const [experiences, setExperiences] = useState<Experience[]>([
    { entreprise: '', ville: '', pays: '', poste: '', heuresSemaine: '', dateDebut: '', dateFin: '', taches: '' }
  ]);

  // Section 4: Déclaration
  const [declaration, setDeclaration] = useState({
    ville: '',
    pays: '',
    nomComplet: '',
    signature: '',
    accepteConditions: false,
  });

  // Gestion de la signature électronique
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

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
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveSignature();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setDeclaration({ ...declaration, signature: '', nomComplet: '' });
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL('image/png');
    setDeclaration({ ...declaration, signature: signatureData });
  };

  // Section 5: Documents
  const [documents, setDocuments] = useState({
    passeport: false,
    domicilePreuve1: false,
    domicilePreuve2: false,
    diplomesLegalises: false,
    relevesNotes: false,
    attestationsEmploi: false,
    lettrePresentation: false,
    preuveLegaliteExperience: false,
    releves1Quebec: false,
    cvFrancais: false,
    permisConduire: false,
  });

  // Fichiers uploadés
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  const handleFileUpload = (docKey: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [docKey]: file }));
  };

  // Pays et villes pour la sélection
  const paysVilles = {
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    'Maroc': ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'],
    'Algérie': ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif'],
    'Tunisie': ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana'],
    'Sénégal': ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Mbour'],
    'Cameroun': ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré'],
    'Côte d\'Ivoire': ['Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pédro'],
    'Mali': ['Bamako', 'Sikasso', 'Mopti', 'Ségou', 'Gao'],
    'Guinée': ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé'],
    'Burkina Faso': ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora'],
    'Togo': ['Lomé', 'Sokodé', 'Kara', 'Kpalimé'],
    'Bénin': ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi'],
    'RDC': ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Goma', 'Bukavu'],
    'Canada': ['Montréal', 'Québec', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'],
    'États-Unis': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
    'Belgique': ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège', 'Bruges'],
    'Suisse': ['Genève', 'Zurich', 'Bâle', 'Lausanne', 'Bern'],
    'Allemagne': ['Berlin', 'Munich', 'Hambourg', 'Cologne', 'Francfort'],
    'Royaume-Uni': ['Londres', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
    'Espagne': ['Madrid', 'Barcelone', 'Valence', 'Séville', 'Bilbao'],
    'Italie': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    'Portugal': ['Lisbonne', 'Porto', 'Braga', 'Coimbra'],
    'Chine': ['Pékin', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
    'Inde': ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'],
    'Brésil': ['São Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'],
    'Mexique': ['Mexico', 'Guadalajara', 'Monterrey', 'Puebla'],
    'Autre': ['Autre'],
  };

  const paysList = Object.keys(paysVilles);
  const villesDuPays = personalInfo.lieuNaissancePays && personalInfo.lieuNaissancePays in paysVilles
    ? paysVilles[personalInfo.lieuNaissancePays as keyof typeof paysVilles]
    : [];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/fr/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setPersonalInfo(prev => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
        prenom: user.firstName || '',
        nomFamille: user.lastName || '',
      }));
    }
  }, [user]);

  // Charger le profil existant au montage
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        const session = (window as any).Clerk?.session;
        const token = session ? await session.getToken() : '';
        const response = await fetch('/api/profil-candidat', {
          headers: {
            'x-clerk-user-id': user.id,
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (response.ok) {
          const profile = await response.json();

          // Section 1
          if (profile.nomFamille) setPersonalInfo(prev => ({
            ...prev,
            nomFamille: profile.nomFamille,
            prenom: profile.prenom || '',
            dateNaissance: profile.dateNaissance?.split('T')[0] || '',
            numeroPasseport: profile.numeroPasseport || '',
            passeportDateDebut: profile.passeportDateDebut?.split('T')[0] || '',
            passeportDateFin: profile.passeportDateFin?.split('T')[0] || '',
            lieuNaissanceVille: profile.lieuNaissanceVille || '',
            lieuNaissanceProvince: profile.lieuNaissanceProvince || '',
            lieuNaissancePays: profile.lieuNaissancePays || '',
            adresseNumero: profile.adresseNumero || '',
            adresseRue: profile.adresseRue || '',
            adresseAppartement: profile.adresseAppartement || '',
            adresseVille: profile.adresseVille || '',
            adresseProvince: profile.adresseProvince || '',
            adresseCodePostal: profile.adresseCodePostal || '',
            adressePays: profile.adressePays || '',
            telephone: profile.telephone || '',
            statutImmigration: profile.statutImmigration || '',
            controleEntreprise: profile.controleEntreprise ? 'Oui' : 'Non',
            controleEntrepriseDetails: profile.controleEntrepriseDetails || '',
          }));

          // Section 2
          if (profile.etudes) setStudies(profile.etudes);

          // Section 3
          if (profile.experiences) setExperiences(profile.experiences);

          // Section 4
          if (profile.declarationVille) setDeclaration(prev => ({
            ...prev,
            ville: profile.declarationVille,
            pays: profile.declarationPays,
            nomComplet: profile.declarationNomComplet,
            signature: profile.declarationSignature,
            accepteConditions: profile.declarationAcceptee,
          }));

          // Section 5
          if (profile.documents) setDocuments(profile.documents);
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    };

    loadProfile();
  }, [user?.id]);

  const validateForm = (): { valid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    // Section 1: Renseignements personnels - Tous obligatoires
    if (!personalInfo.nomFamille?.trim()) missingFields.push('Nom de famille');
    if (!personalInfo.prenom?.trim()) missingFields.push('Prénom');
    if (!personalInfo.dateNaissance) missingFields.push('Date de naissance');
    if (!personalInfo.numeroPasseport?.trim()) missingFields.push('Numéro de passeport');
    if (!personalInfo.passeportDateDebut) missingFields.push('Date de début de validité du passeport');
    if (!personalInfo.passeportDateFin) missingFields.push('Date de fin de validité du passeport');
    if (!personalInfo.lieuNaissanceVille?.trim()) missingFields.push('Ville de naissance');
    if (!personalInfo.lieuNaissanceProvince?.trim()) missingFields.push('Province/État de naissance');
    if (!personalInfo.lieuNaissancePays?.trim()) missingFields.push('Pays de naissance');
    if (!personalInfo.adresseNumero?.trim()) missingFields.push('Numéro de l\'adresse');
    if (!personalInfo.adresseRue?.trim()) missingFields.push('Rue');
    if (!personalInfo.adresseVille?.trim()) missingFields.push('Ville de résidence');
    if (!personalInfo.adresseProvince?.trim()) missingFields.push('Province/État de résidence');
    if (!personalInfo.adresseCodePostal?.trim()) missingFields.push('Code postal');
    if (!personalInfo.adressePays?.trim()) missingFields.push('Pays de résidence');
    if (!personalInfo.telephone?.trim()) missingFields.push('Téléphone');
    if (!personalInfo.resideQuebec) missingFields.push('Statut de résidence au Québec');
    if (!personalInfo.statutImmigration?.trim()) missingFields.push('Statut d\'immigration');
    if (!personalInfo.controleEntreprise) missingFields.push('Contrôle d\'entreprise');

    // Section 2: Études - Au moins une entrée complète requise
    const hasValidStudy = studies.some(s => s.etablissement?.trim() && s.pays?.trim() && s.diplome?.trim() && s.domaine?.trim() && s.dateDebut && s.dateFin);
    if (!hasValidStudy) missingFields.push('Au moins une formation complète (établissement, pays, diplôme, domaine, dates)');

    // Section 3: Expériences - Au moins une entrée complète requise
    const hasValidExperience = experiences.some(e => e.entreprise?.trim() && e.ville?.trim() && e.pays?.trim() && e.poste?.trim() && e.heuresSemaine?.trim() && e.dateDebut && e.dateFin && e.taches?.trim());
    if (!hasValidExperience) missingFields.push('Au moins une expérience professionnelle complète');

    // Section 4: Déclaration - Tous obligatoires
    if (!declaration.ville?.trim()) missingFields.push('Ville de déclaration');
    if (!declaration.pays?.trim()) missingFields.push('Pays de déclaration');
    if (!declaration.nomComplet?.trim()) missingFields.push('Nom complet pour signature');
    if (!declaration.signature) missingFields.push('Signature électronique');
    if (!declaration.accepteConditions) missingFields.push('Acceptation des conditions de déclaration');

    // Section 5: Documents - CV obligatoire
    if (!documents.cvFrancais) missingFields.push('Curriculum vitae en français (obligatoire)');

    return { valid: missingFields.length === 0, missingFields };
  };

  const handleSave = async () => {
    // Validation avant sauvegarde
    const validation = validateForm();
    if (!validation.valid) {
      alert('Veuillez remplir tous les champs obligatoires :\n\n• ' + validation.missingFields.join('\n• '));
      return;
    }

    setIsSaving(true);
    try {
      // Préparer les données pour l'API
      const profileData = {
        // Section 1
        nomFamille: personalInfo.nomFamille,
        prenom: personalInfo.prenom,
        dateNaissance: personalInfo.dateNaissance,
        numeroPasseport: personalInfo.numeroPasseport,
        passeportDateDebut: personalInfo.passeportDateDebut,
        passeportDateFin: personalInfo.passeportDateFin,
        lieuNaissanceVille: personalInfo.lieuNaissanceVille,
        lieuNaissanceProvince: personalInfo.lieuNaissanceProvince,
        lieuNaissancePays: personalInfo.lieuNaissancePays,
        adresseNumero: personalInfo.adresseNumero,
        adresseRue: personalInfo.adresseRue,
        adresseAppartement: personalInfo.adresseAppartement,
        adresseVille: personalInfo.adresseVille,
        adresseProvince: personalInfo.adresseProvince,
        adresseCodePostal: personalInfo.adresseCodePostal,
        adressePays: personalInfo.adressePays,
        telephone: personalInfo.telephone,
        statutImmigration: personalInfo.statutImmigration,
        controleEntreprise: personalInfo.controleEntreprise === 'Oui',
        controleEntrepriseDetails: personalInfo.controleEntrepriseDetails,
        // Section 2
        etudes: studies,
        // Section 3
        experiences: experiences,
        // Section 4
        declarationVille: declaration.ville,
        declarationPays: declaration.pays,
        declarationNomComplet: declaration.nomComplet,
        declarationSignature: declaration.signature,
        declarationAcceptee: declaration.accepteConditions,
        // Section 5
        documents,
        fichiersUploades: Object.fromEntries(
          Object.entries(uploadedFiles).map(([key, file]) => [key, file?.name || null])
        ),
        email: user?.emailAddresses?.[0]?.emailAddress || '',
      };

      // Récupérer le token Clerk
      const session = (window as any).Clerk?.session;
      const token = session ? await session.getToken() : '';

      const response = await fetch('/api/profil-candidat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-clerk-user-id': user?.id || '',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(profileData),
      });

      console.log('Status response:', response.status, response.statusText);
      const text = await response.text();
      console.log('Raw response:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = { error: 'Réponse non-JSON', raw: text.substring(0, 500) };
      }

      if (!response.ok) {
        console.error('Détails erreur API:', result);
        throw new Error(result.details || result.error || 'Erreur lors de la sauvegarde');
      }

      alert('Profil sauvegardé avec succès !\n\nUne notification a été envoyée à notre équipe administrative pour validation.\nVous serez contacté une fois votre profil validé.');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil. Veuillez réessayer.\n\nDétail: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSaving(false);
    }
  };

  const addStudy = () => {
    if (studies.length < 5) {
      setStudies([...studies, { etablissement: '', pays: '', diplome: '', domaine: '', dateDebut: '', dateFin: '' }]);
    }
  };

  const addExperience = () => {
    if (experiences.length < 5) {
      setExperiences([...experiences, { entreprise: '', ville: '', pays: '', poste: '', heuresSemaine: '', dateDebut: '', dateFin: '', taches: '' }]);
    }
  };

  const updateStudy = (index: number, field: keyof Study, value: string) => {
    const updated = [...studies];
    updated[index] = { ...updated[index], [field]: value };
    setStudies(updated);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6 border border-violet-500/20">
        <h3 className="text-lg font-semibold text-violet-400 mb-4">1.1 Informations passeport <span className="text-xs text-red-400">*</span></h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de famille (tel que dans le passeport) <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.nomFamille}
              onChange={(e) => setPersonalInfo({ ...personalInfo, nomFamille: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Tel que dans le passeport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Prénom(s) (tel que dans le passeport) <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.prenom}
              onChange={(e) => setPersonalInfo({ ...personalInfo, prenom: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Tel que dans le passeport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date de naissance <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={personalInfo.dateNaissance}
              onChange={(e) => setPersonalInfo({ ...personalInfo, dateNaissance: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Numéro de passeport <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.numeroPasseport}
              onChange={(e) => setPersonalInfo({ ...personalInfo, numeroPasseport: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date de début de validité <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={personalInfo.passeportDateDebut}
              onChange={(e) => setPersonalInfo({ ...personalInfo, passeportDateDebut: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date de fin de validité <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={personalInfo.passeportDateFin}
              onChange={(e) => setPersonalInfo({ ...personalInfo, passeportDateFin: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-emerald-400 mb-4">1.2 Lieu de naissance <span className="text-xs text-red-400">*</span></h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">Pays <span className="text-red-400">*</span></label>
            <select
              value={personalInfo.lieuNaissancePays}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissancePays: e.target.value, lieuNaissanceVille: '' })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Sélectionner un pays</option>
              {paysList.map((pays) => (
                <option key={pays} value={pays}>{pays}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ville <span className="text-red-400">*</span></label>
            <select
              value={personalInfo.lieuNaissanceVille}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissanceVille: e.target.value })}
              disabled={!personalInfo.lieuNaissancePays}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Sélectionner une ville</option>
              {villesDuPays.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Province/État <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.lieuNaissanceProvince}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissanceProvince: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Île-de-France, Casablanca-Settat..."
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">1.3 Adresse du domicile</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Numéro</label>
            <input
              type="text"
              value={personalInfo.adresseNumero}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseNumero: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rue</label>
            <input
              type="text"
              value={personalInfo.adresseRue}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseRue: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Appartement</label>
            <input
              type="text"
              value={personalInfo.adresseAppartement}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseAppartement: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ville</label>
            <input
              type="text"
              value={personalInfo.adresseVille}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseVille: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Province/État</label>
            <input
              type="text"
              value={personalInfo.adresseProvince}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseProvince: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Code postal</label>
            <input
              type="text"
              value={personalInfo.adresseCodePostal}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseCodePostal: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pays</label>
            <input
              type="text"
              value={personalInfo.adressePays}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adressePays: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input
              type="tel"
              value={personalInfo.telephone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, telephone: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Courriel</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
        <h3 className="text-lg font-semibold text-amber-400 mb-4">1.4 Statut d'immigration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Résidez-vous au Québec ?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resideQuebec"
                  checked={personalInfo.resideQuebec === 'Oui'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, resideQuebec: e.target.value })}
                  value="Oui"
                  className="h-4 w-4 text-amber-500"
                />
                <span>Oui</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resideQuebec"
                  checked={personalInfo.resideQuebec === 'Non'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, resideQuebec: e.target.value })}
                  value="Non"
                  className="h-4 w-4 text-amber-500"
                />
                <span>Non</span>
              </label>
            </div>
          </div>
          {personalInfo.resideQuebec === 'Oui' && (
            <div>
              <label className="block text-sm font-medium mb-2">Précisez votre statut d'immigration</label>
              <input
                type="text"
                value={personalInfo.statutImmigration}
                onChange={(e) => setPersonalInfo({ ...personalInfo, statutImmigration: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: Travailleur temporaire, Résident permanent, etc."
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Exercez-vous un contrôle juridique ou de fait sur l'entreprise ?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="controleEntreprise"
                  checked={personalInfo.controleEntreprise === 'Oui'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, controleEntreprise: e.target.value })}
                  value="Oui"
                  className="h-4 w-4 text-amber-500"
                />
                <span>Oui</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="controleEntreprise"
                  checked={personalInfo.controleEntreprise === 'Non'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, controleEntreprise: e.target.value })}
                  value="Non"
                  className="h-4 w-4 text-amber-500"
                />
                <span>Non</span>
              </label>
            </div>
          </div>
          {personalInfo.controleEntreprise === 'Oui' && (
            <div>
              <label className="block text-sm font-medium mb-2">Précisez</label>
              <textarea
                value={personalInfo.controleEntrepriseDetails}
                onChange={(e) => setPersonalInfo({ ...personalInfo, controleEntrepriseDetails: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
                placeholder="Détails du contrôle..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Ajoutez vos études secondaires et postsecondaires. Maximum 5 entrées.
      </p>
      {studies.map((study, index) => (
        <div key={index} className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6 border border-violet-500/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-violet-400">2.{index + 1} Établissement {index + 1}</h3>
            {index === studies.length - 1 && studies.length < 5 && (
              <button
                onClick={addStudy}
                className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                + Ajouter un autre
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Nom de l'établissement</label>
              <input
                type="text"
                value={study.etablissement}
                onChange={(e) => updateStudy(index, 'etablissement', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pays</label>
              <input
                type="text"
                value={study.pays}
                onChange={(e) => updateStudy(index, 'pays', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Titre du diplôme obtenu</label>
              <input
                type="text"
                value={study.diplome}
                onChange={(e) => updateStudy(index, 'diplome', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Domaine de formation</label>
              <input
                type="text"
                value={study.domaine}
                onChange={(e) => updateStudy(index, 'domaine', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <input
                type="month"
                value={study.dateDebut}
                onChange={(e) => updateStudy(index, 'dateDebut', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <input
                type="month"
                value={study.dateFin}
                onChange={(e) => updateStudy(index, 'dateFin', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Ajoutez vos expériences professionnelles reliées à l'offre d'emploi et toutes vos expériences des 5 dernières années. Maximum 5 entrées.
      </p>
      {experiences.map((exp, index) => (
        <div key={index} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-emerald-400">3.{index + 1} Expérience {index + 1}</h3>
            {index === experiences.length - 1 && experiences.length < 5 && (
              <button
                onClick={addExperience}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                + Ajouter une autre
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Nom complet de l'entreprise</label>
              <input
                type="text"
                value={exp.entreprise}
                onChange={(e) => updateExperience(index, 'entreprise', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ville</label>
              <input
                type="text"
                value={exp.ville}
                onChange={(e) => updateExperience(index, 'ville', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pays</label>
              <input
                type="text"
                value={exp.pays}
                onChange={(e) => updateExperience(index, 'pays', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Titre du poste occupé</label>
              <input
                type="text"
                value={exp.poste}
                onChange={(e) => updateExperience(index, 'poste', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nombre d'heures/semaine</label>
              <input
                type="number"
                value={exp.heuresSemaine}
                onChange={(e) => updateExperience(index, 'heuresSemaine', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <input
                type="month"
                value={exp.dateDebut}
                onChange={(e) => updateExperience(index, 'dateDebut', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <input
                type="month"
                value={exp.dateFin}
                onChange={(e) => updateExperience(index, 'dateFin', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Principales tâches accomplies</label>
              <textarea
                value={exp.taches}
                onChange={(e) => updateExperience(index, 'taches', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
                placeholder="Décrivez vos principales responsabilités..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSection4 = () => (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
      <h3 className="text-lg font-semibold text-amber-400 mb-4">4. Déclaration du candidat</h3>
      <div className="space-y-4">
        <div className="bg-background/50 rounded-lg p-4 text-sm">
          <p className="mb-4">
            J'ai pris connaissance du contenu de ce formulaire, y compris ses conditions, telles que détaillées sur la page du cabinet DETIE,
            et j'ai l'intention d'occuper un emploi dans le cadre de mon projet d'immigration au Québec.
          </p>
          <p className="text-xs text-muted-foreground italic">
            NB: En remplissant ce formulaire, vous acceptez l'accompagnement du Cabinet DETIE pour l'évaluation des compétences,
            des expériences professionnelles ainsi que du coaching de ses experts à travers le monde s'il y a lieu.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Ville</label>
            <input
              type="text"
              value={declaration.ville}
              onChange={(e) => setDeclaration({ ...declaration, ville: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pays</label>
            <input
              type="text"
              value={declaration.pays}
              onChange={(e) => setDeclaration({ ...declaration, pays: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nom complet (pour la signature)</label>
          <input
            type="text"
            value={declaration.nomComplet}
            onChange={(e) => setDeclaration({ ...declaration, nomComplet: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Votre nom complet tel qu'il apparaîtra sur la signature"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Signature électronique</label>
          <div className="rounded-lg border border-border bg-background p-2">
            <div className="relative w-full h-32 md:h-48">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-full cursor-crosshair touch-none rounded border border-border"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
            >
              <X className="h-4 w-4" />
              Effacer
            </button>
            {hasSignature && (
              <span className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Signature enregistrée
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <PenTool className="h-3 w-3 inline mr-1" />
            Dessinez votre signature dans le cadre ci-dessus
          </p>
        </div>
        <div className="flex items-start gap-3 pt-4">
          <input
            type="checkbox"
            id="accepteConditions"
            checked={declaration.accepteConditions}
            onChange={(e) => setDeclaration({ ...declaration, accepteConditions: e.target.checked })}
            className="h-4 w-4 mt-1 text-amber-500 rounded"
          />
          <label htmlFor="accepteConditions" className="text-sm">
            Je déclare que les informations fournies sont exactes et complètes. Je comprends que toute fausse déclaration peut entraîner le rejet de ma candidature.
          </label>
        </div>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      {/* Section CV mise en évidence */}
      <div id="documents" className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Uploader mon CV
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ajoutez votre curriculum vitae en français à votre profil
        </p>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="doc-cvFrancais"
              checked={documents.cvFrancais}
              onChange={(e) => setDocuments({ ...documents, cvFrancais: e.target.checked })}
              className="h-5 w-5 text-emerald-500 rounded"
            />
            <label htmlFor="doc-cvFrancais" className="text-sm font-medium cursor-pointer">
              Curriculum vitae en francais
            </label>
          </div>
          {documents.cvFrancais && (
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-cvFrancais"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('cvFrancais', file);
                }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              {uploadedFiles.cvFrancais ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{uploadedFiles.cvFrancais.name}</span>
                </div>
              ) : (
                <label
                  htmlFor="file-cvFrancais"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer transition-colors text-xs font-medium"
                >
                  <Upload className="h-3 w-3" />
                  Choisir fichier
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Autres documents */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Autres documents à soumettre</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Cochez tous les documents que vous fournissez. Si vous ne fournissez pas un document qui s'applique à votre demande, veuillez fournir une lettre d'explication.
        </p>
        <div className="space-y-3">
          {[
            { key: 'passeport', label: 'Passeport valide' },
            { key: 'domicilePreuve1', label: 'Preuve de domicile au Quebec (1/2)' },
            { key: 'domicilePreuve2', label: 'Preuve de domicile au Quebec (2/2)' },
            { key: 'diplomesLegalises', label: 'Diplomes legalises' },
            { key: 'relevesNotes', label: 'Releves de notes legalises' },
            { key: 'attestationsEmploi', label: 'Attestations demploi' },
            { key: 'lettrePresentation', label: 'Lettre de presentation' },
            { key: 'preuveLegaliteExperience', label: 'Preuve de legalite (etranger)' },
            { key: 'releves1Quebec', label: 'Releves 1 (Quebec)' },
            { key: 'permisConduire', label: 'Permis de conduire' },
          ].map((doc) => (
            <div
              key={doc.key}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`doc-${doc.key}`}
                checked={documents[doc.key as keyof typeof documents]}
                onChange={(e) => setDocuments({ ...documents, [doc.key]: e.target.checked })}
                className="h-5 w-5 text-blue-500 rounded"
              />
              <label htmlFor={`doc-${doc.key}`} className="text-sm font-medium cursor-pointer">
                {doc.label}
              </label>
            </div>
            {documents[doc.key as keyof typeof documents] && (
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id={`file-${doc.key}`}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(doc.key, file);
                  }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {uploadedFiles[doc.key] ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">{(uploadedFiles[doc.key] as File)?.name}</span>
                  </div>
                ) : (
                  <label
                    htmlFor={`file-${doc.key}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer transition-colors text-xs font-medium"
                  >
                    <Upload className="h-3 w-3" />
                    Choisir fichier
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
        </div>
        <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
            <p className="text-sm text-amber-200">
              Si vous ne fournissez pas un document qui s'applique à votre demande, vous devez joindre une lettre d'explication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950/30 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/fr/compte/dashboard/candidat"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-emerald-400">
            Mon Profil Candidat
          </h1>
          <p className="text-muted-foreground">
            Renseignements sur la travailleuse ou le travailleur étranger
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <span className="font-semibold">*</span>
            <span>Tous les champs sont obligatoires. Veuillez remplir chaque section complètement avant de continuer.</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progression du profil</span>
            <span className="text-sm text-muted-foreground">
              Section {activeSection} sur 5
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${(activeSection / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { num: 1, label: 'Renseignements personnels' },
            { num: 2, label: 'Études' },
            { num: 3, label: 'Expériences' },
            { num: 4, label: 'Déclaration' },
            { num: 5, label: 'Documents' },
          ].map((section) => (
            <button
              key={section.num}
              onClick={() => setActiveSection(section.num)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === section.num
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {section.num}. {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {activeSection === 1 && renderSection1()}
          {activeSection === 2 && renderSection2()}
          {activeSection === 3 && renderSection3()}
          {activeSection === 4 && renderSection4()}
          {activeSection === 5 && renderSection5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setActiveSection(Math.max(1, activeSection - 1))}
            disabled={activeSection === 1}
            className="px-6 py-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Section précédente
          </button>
          {activeSection < 5 ? (
            <button
              onClick={() => setActiveSection(Math.min(5, activeSection + 1))}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Section suivante →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isSaving ? 'Enregistrement...' : 'Soumettre le profil'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
