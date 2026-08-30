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

  // Section 1: Personal Information
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

  // Section 2: Education (5 entries max)
  const [studies, setStudies] = useState<Study[]>([
    { etablissement: '', pays: '', diplome: '', domaine: '', dateDebut: '', dateFin: '' }
  ]);

  // Section 3: Work Experience (5 entries max)
  const [experiences, setExperiences] = useState<Experience[]>([
    { entreprise: '', ville: '', pays: '', poste: '', heuresSemaine: '', dateDebut: '', dateFin: '', taches: '' }
  ]);

  // Section 4: Declaration
  const [declaration, setDeclaration] = useState({
    ville: '',
    pays: '',
    nomComplet: '',
    signature: '',
    accepteConditions: false,
  });

  // Electronic signature management
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

  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  const handleFileUpload = (docKey: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [docKey]: file }));
  };

  // Countries and cities for selection
  const paysVilles = {
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    'Maroc': ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tanger', 'Agadir', 'Meknes', 'Oujda'],
    'Algerie': ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Setif'],
    'Tunisie': ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabes', 'Ariana'],
    'Senegal': ['Dakar', 'Thies', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Mbour'],
    'Cameroun': ['Douala', 'Yaounde', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundere'],
    'Cote d\'Ivoire': ['Abidjan', 'Yamoussoukro', 'Bouake', 'Daloa', 'San-Pedro'],
    'Mali': ['Bamako', 'Sikasso', 'Mopti', 'Segou', 'Gao'],
    'Guinee': ['Conakry', 'Nzerekore', 'Kankan', 'Kindia', 'Labe'],
    'Burkina Faso': ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora'],
    'Togo': ['Lome', 'Sokode', 'Kara', 'Kpalime'],
    'Benin': ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi'],
    'RDC': ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Goma', 'Bukavu'],
    'Canada': ['Montreal', 'Quebec', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
    'Belgique': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liege', 'Bruges'],
    'Suisse': ['Geneva', 'Zurich', 'Basel', 'Lausanne', 'Bern'],
    'Allemagne': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'Royaume-Uni': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'],
    'Espagne': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
    'Italie': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    'Portugal': ['Lisbon', 'Porto', 'Braga', 'Coimbra'],
    'Chine': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu'],
    'Inde': ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'],
    'Bresil': ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'],
    'Mexique': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla'],
    'Autre': ['Other'],
  };

  const paysList = Object.keys(paysVilles);
  const villesDuPays = personalInfo.lieuNaissancePays && personalInfo.lieuNaissancePays in paysVilles
    ? paysVilles[personalInfo.lieuNaissancePays as keyof typeof paysVilles]
    : [];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/en/compte/connexion');
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

  // Load existing profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        const token = await window.Clerk?.session?.getToken();
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
            controleEntreprise: profile.controleEntreprise ? 'Yes' : 'No',
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
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user?.id]);

  const validateForm = (): { valid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];

    // Section 1: Personal Information - All required
    if (!personalInfo.nomFamille?.trim()) missingFields.push('Last name');
    if (!personalInfo.prenom?.trim()) missingFields.push('First name');
    if (!personalInfo.dateNaissance) missingFields.push('Date of birth');
    if (!personalInfo.numeroPasseport?.trim()) missingFields.push('Passport number');
    if (!personalInfo.passeportDateDebut) missingFields.push('Passport start date');
    if (!personalInfo.passeportDateFin) missingFields.push('Passport end date');
    if (!personalInfo.lieuNaissanceVille?.trim()) missingFields.push('City of birth');
    if (!personalInfo.lieuNaissanceProvince?.trim()) missingFields.push('Province/State of birth');
    if (!personalInfo.lieuNaissancePays?.trim()) missingFields.push('Country of birth');
    if (!personalInfo.adresseNumero?.trim()) missingFields.push('Address number');
    if (!personalInfo.adresseRue?.trim()) missingFields.push('Street');
    if (!personalInfo.adresseVille?.trim()) missingFields.push('City of residence');
    if (!personalInfo.adresseProvince?.trim()) missingFields.push('Province/State of residence');
    if (!personalInfo.adresseCodePostal?.trim()) missingFields.push('Postal code');
    if (!personalInfo.adressePays?.trim()) missingFields.push('Country of residence');
    if (!personalInfo.telephone?.trim()) missingFields.push('Phone');
    if (!personalInfo.resideQuebec) missingFields.push('Quebec residence status');
    if (!personalInfo.statutImmigration?.trim()) missingFields.push('Immigration status');
    if (!personalInfo.controleEntreprise) missingFields.push('Company control');

    // Section 2: Education - At least one complete entry required
    const hasValidStudy = studies.some(s => s.etablissement?.trim() && s.pays?.trim() && s.diplome?.trim() && s.domaine?.trim() && s.dateDebut && s.dateFin);
    if (!hasValidStudy) missingFields.push('At least one complete education entry (institution, country, diploma, field, dates)');

    // Section 3: Experience - At least one complete entry required
    const hasValidExperience = experiences.some(e => e.entreprise?.trim() && e.ville?.trim() && e.pays?.trim() && e.poste?.trim() && e.heuresSemaine?.trim() && e.dateDebut && e.dateFin && e.taches?.trim());
    if (!hasValidExperience) missingFields.push('At least one complete work experience');

    // Section 4: Declaration - All required
    if (!declaration.ville?.trim()) missingFields.push('Declaration city');
    if (!declaration.pays?.trim()) missingFields.push('Declaration country');
    if (!declaration.nomComplet?.trim()) missingFields.push('Full name for signature');
    if (!declaration.signature) missingFields.push('Electronic signature');
    if (!declaration.accepteConditions) missingFields.push('Acceptance of declaration conditions');

    // Section 5: Documents - CV required
    if (!documents.cvFrancais) missingFields.push('Curriculum vitae in French (required)');

    return { valid: missingFields.length === 0, missingFields };
  };

  const handleSave = async () => {
    // Validation before save
    const validation = validateForm();
    if (!validation.valid) {
      alert('Please fill in all required fields:\n\n• ' + validation.missingFields.join('\n• '));
      return;
    }

    setIsSaving(true);
    try {
      // Prepare data for API
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
        controleEntreprise: personalInfo.controleEntreprise === 'Yes',
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

      // Get Clerk token
      const token = await window.Clerk?.session?.getToken();

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
        result = { error: 'Non-JSON response', raw: text.substring(0, 500) };
      }

      if (!response.ok) {
        console.error('API error details:', result);
        throw new Error(result.details || result.error || 'Error saving');
      }

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving profile. Please try again.\n\nDetail: ' + (error instanceof Error ? error.message : String(error)));
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
        <h3 className="text-lg font-semibold text-violet-400 mb-4">1.1 Passport Information <span className="text-xs text-red-400">*</span></h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Last name (as in passport) <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.nomFamille}
              onChange={(e) => setPersonalInfo({ ...personalInfo, nomFamille: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="As in passport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">First name(s) (as in passport) <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.prenom}
              onChange={(e) => setPersonalInfo({ ...personalInfo, prenom: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="As in passport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of birth <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={personalInfo.dateNaissance}
              onChange={(e) => setPersonalInfo({ ...personalInfo, dateNaissance: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Passport number <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.numeroPasseport}
              onChange={(e) => setPersonalInfo({ ...personalInfo, numeroPasseport: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start date <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={personalInfo.passeportDateDebut}
              onChange={(e) => setPersonalInfo({ ...personalInfo, passeportDateDebut: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End date <span className="text-red-400">*</span></label>
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
        <h3 className="text-lg font-semibold text-emerald-400 mb-4">1.2 Place of Birth <span className="text-xs text-red-400">*</span></h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">Country <span className="text-red-400">*</span></label>
            <select
              value={personalInfo.lieuNaissancePays}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissancePays: e.target.value, lieuNaissanceVille: '' })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a country</option>
              {paysList.map((pays) => (
                <option key={pays} value={pays}>{pays}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City <span className="text-red-400">*</span></label>
            <select
              value={personalInfo.lieuNaissanceVille}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissanceVille: e.target.value })}
              disabled={!personalInfo.lieuNaissancePays}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a city</option>
              {villesDuPays.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Province/State <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={personalInfo.lieuNaissanceProvince}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissanceProvince: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex: Ile-de-France, Casablanca-Settat..."
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">1.3 Home Address</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Number</label>
            <input
              type="text"
              value={personalInfo.adresseNumero}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseNumero: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Street</label>
            <input
              type="text"
              value={personalInfo.adresseRue}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseRue: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Apartment</label>
            <input
              type="text"
              value={personalInfo.adresseAppartement}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseAppartement: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={personalInfo.adresseVille}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseVille: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Province/State</label>
            <input
              type="text"
              value={personalInfo.adresseProvince}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseProvince: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Postal Code</label>
            <input
              type="text"
              value={personalInfo.adresseCodePostal}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adresseCodePostal: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={personalInfo.adressePays}
              onChange={(e) => setPersonalInfo({ ...personalInfo, adressePays: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={personalInfo.telephone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, telephone: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Email</label>
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
        <h3 className="text-lg font-semibold text-amber-400 mb-4">1.4 Immigration Status</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Do you reside in Quebec?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resideQuebec"
                  checked={personalInfo.resideQuebec === 'Yes'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, resideQuebec: e.target.value })}
                  value="Yes"
                  className="h-4 w-4 text-amber-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="resideQuebec"
                  checked={personalInfo.resideQuebec === 'No'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, resideQuebec: e.target.value })}
                  value="No"
                  className="h-4 w-4 text-amber-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          {personalInfo.resideQuebec === 'Yes' && (
            <div>
              <label className="block text-sm font-medium mb-2">Specify your immigration status</label>
              <input
                type="text"
                value={personalInfo.statutImmigration}
                onChange={(e) => setPersonalInfo({ ...personalInfo, statutImmigration: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ex: Temporary worker, Permanent resident, etc."
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Do you exercise legal or de facto control over the company?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="controleEntreprise"
                  checked={personalInfo.controleEntreprise === 'Yes'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, controleEntreprise: e.target.value })}
                  value="Yes"
                  className="h-4 w-4 text-amber-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="controleEntreprise"
                  checked={personalInfo.controleEntreprise === 'No'}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, controleEntreprise: e.target.value })}
                  value="No"
                  className="h-4 w-4 text-amber-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>
          {personalInfo.controleEntreprise === 'Yes' && (
            <div>
              <label className="block text-sm font-medium mb-2">Specify</label>
              <textarea
                value={personalInfo.controleEntrepriseDetails}
                onChange={(e) => setPersonalInfo({ ...personalInfo, controleEntrepriseDetails: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
                placeholder="Control details..."
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
        Add your secondary and postsecondary education. Maximum 5 entries.
      </p>
      {studies.map((study, index) => (
        <div key={index} className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6 border border-violet-500/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-violet-400">2.{index + 1} Institution {index + 1}</h3>
            {index === studies.length - 1 && studies.length < 5 && (
              <button
                onClick={addStudy}
                className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                + Add another
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Institution name</label>
              <input
                type="text"
                value={study.etablissement}
                onChange={(e) => updateStudy(index, 'etablissement', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={study.pays}
                onChange={(e) => updateStudy(index, 'pays', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Diploma title</label>
              <input
                type="text"
                value={study.diplome}
                onChange={(e) => updateStudy(index, 'diplome', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Field of study</label>
              <input
                type="text"
                value={study.domaine}
                onChange={(e) => updateStudy(index, 'domaine', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start date</label>
              <input
                type="month"
                value={study.dateDebut}
                onChange={(e) => updateStudy(index, 'dateDebut', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End date</label>
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
        Add your work experience related to the job offer and all your experience from the last 5 years. Maximum 5 entries.
      </p>
      {experiences.map((exp, index) => (
        <div key={index} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-emerald-400">3.{index + 1} Experience {index + 1}</h3>
            {index === experiences.length - 1 && experiences.length < 5 && (
              <button
                onClick={addExperience}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                + Add another
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Company name</label>
              <input
                type="text"
                value={exp.entreprise}
                onChange={(e) => updateExperience(index, 'entreprise', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={exp.ville}
                onChange={(e) => updateExperience(index, 'ville', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={exp.pays}
                onChange={(e) => updateExperience(index, 'pays', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job title</label>
              <input
                type="text"
                value={exp.poste}
                onChange={(e) => updateExperience(index, 'poste', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hours per week</label>
              <input
                type="number"
                value={exp.heuresSemaine}
                onChange={(e) => updateExperience(index, 'heuresSemaine', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start date</label>
              <input
                type="month"
                value={exp.dateDebut}
                onChange={(e) => updateExperience(index, 'dateDebut', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End date</label>
              <input
                type="month"
                value={exp.dateFin}
                onChange={(e) => updateExperience(index, 'dateFin', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Main tasks</label>
              <textarea
                value={exp.taches}
                onChange={(e) => updateExperience(index, 'taches', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
                placeholder="Describe your main responsibilities..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSection4 = () => (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
      <h3 className="text-lg font-semibold text-amber-400 mb-4">4. Candidate Declaration</h3>
      <div className="space-y-4">
        <div className="bg-background/50 rounded-lg p-4 text-sm">
          <p className="mb-4">
            I have read the content of this form, including its conditions, as detailed on the Cabinet DETIE website,
            and I intend to work in the context of my immigration project to Quebec.
          </p>
          <p className="text-xs text-muted-foreground italic">
            NB: By completing this form, you accept the support of Cabinet DETIE for skills assessment,
            professional experience evaluation, and coaching from its experts worldwide if applicable.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={declaration.ville}
              onChange={(e) => setDeclaration({ ...declaration, ville: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={declaration.pays}
              onChange={(e) => setDeclaration({ ...declaration, pays: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Full name (for signature)</label>
          <input
            type="text"
            value={declaration.nomComplet}
            onChange={(e) => setDeclaration({ ...declaration, nomComplet: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Your full name as it will appear on the signature"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Electronic signature</label>
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
              Clear
            </button>
            {hasSignature && (
              <span className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Signature saved
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <PenTool className="h-3 w-3 inline mr-1" />
            Draw your signature in the box above
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
            I declare that the information provided is accurate and complete. I understand that any false statement may result in the rejection of my application.
          </label>
        </div>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      {/* CV Section highlighted */}
      <div id="documents" className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload my CV
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your curriculum vitae in French to your profile
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
              Curriculum vitae in French
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
                  Choose file
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Other documents */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Other documents to submit</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Check all documents you are providing. If you are not providing a document that applies to your application, please provide an explanation letter.
        </p>
        <div className="space-y-3">
          {[
            { key: 'passeport', label: 'Valid passport' },
            { key: 'domicilePreuve1', label: 'Proof of Quebec residence (1/2)' },
            { key: 'domicilePreuve2', label: 'Proof of Quebec residence (2/2)' },
            { key: 'diplomesLegalises', label: 'Legalized diplomas' },
            { key: 'relevesNotes', label: 'Legalized transcripts' },
            { key: 'attestationsEmploi', label: 'Employment certificates' },
            { key: 'lettrePresentation', label: 'Cover letter' },
            { key: 'preuveLegaliteExperience', label: 'Proof of legality (foreign)' },
            { key: 'releves1Quebec', label: 'Transcripts 1 (Quebec)' },
            { key: 'permisConduire', label: 'Driver\'s license' },
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
                      <span className="max-w-[150px] truncate">{uploadedFiles[doc.key].name}</span>
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-${doc.key}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer transition-colors text-xs font-medium"
                    >
                      <Upload className="h-3 w-3" />
                      Choose file
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
              If you are not providing a document that applies to your application, you must attach an explanation letter.
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
              href="/en/compte/dashboard/candidat"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
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
            My Candidate Profile
          </h1>
          <p className="text-muted-foreground">
            Foreign worker information
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <span className="font-semibold">*</span>
            <span>All fields are required. Please fill each section completely before continuing.</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Profile progress</span>
            <span className="text-sm text-muted-foreground">
              Section {activeSection} of 5
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
            { num: 1, label: 'Personal Information' },
            { num: 2, label: 'Education' },
            { num: 3, label: 'Work Experience' },
            { num: 4, label: 'Declaration' },
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
            ← Previous Section
          </button>
          {activeSection < 5 ? (
            <button
              onClick={() => setActiveSection(Math.min(5, activeSection + 1))}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Next Section →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Submit Profile'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
