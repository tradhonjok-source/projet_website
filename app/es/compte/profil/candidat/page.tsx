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

  const [personalInfo, setPersonalInfo] = useState({
    nomFamille: '', prenom: '', dateNaissance: '', numeroPasseport: '',
    passeportDateDebut: '', passeportDateFin: '', lieuNaissanceVille: '',
    lieuNaissanceProvince: '', lieuNaissancePays: '', adresseNumero: '',
    adresseRue: '', adresseAppartement: '', adresseVille: '', adresseProvince: '',
    adresseCodePostal: '', adressePays: '', telephone: '', email: '',
    resideQuebec: '', statutImmigration: '', controleEntreprise: '', controleEntrepriseDetails: '',
  });

  const [studies, setStudies] = useState<Study[]>([
    { etablissement: '', pays: '', diplome: '', domaine: '', dateDebut: '', dateFin: '' }
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    { entreprise: '', ville: '', pays: '', poste: '', heuresSemaine: '', dateDebut: '', dateFin: '', taches: '' }
  ]);

  const [declaration, setDeclaration] = useState({
    ville: '', pays: '', nomComplet: '', signature: '', accepteConditions: false,
  });

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

  const [documents, setDocuments] = useState({
    passeport: false, domicilePreuve1: false, domicilePreuve2: false,
    diplomesLegalises: false, relevesNotes: false, attestationsEmploi: false,
    lettrePresentation: false, preuveLegaliteExperience: false,
    releves1Quebec: false, cvFrancais: false, permisConduire: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  const handleFileUpload = (docKey: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [docKey]: file }));
  };

  const paysVilles = {
    'Francia': ['París', 'Lyon', 'Marsella', 'Toulouse', 'Niza', 'Nantes', 'Estrasburgo', 'Montpellier', 'Burdeos', 'Lille'],
    'Marruecos': ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tánger', 'Agadir', 'Meknès', 'Oujda'],
    'Argelia': ['Argel', 'Orán', 'Constantina', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif'],
    'Túnez': ['Túnez', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana'],
    'Senegal': ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Mbour'],
    'Camerún': ['Douala', 'Yaundé', 'Bafoussam', 'Garoua', 'Maroua', 'Ngaoundéré'],
    'Costa de Marfil': ['Abidján', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pédro'],
    'Malí': ['Bamako', 'Sikasso', 'Mopti', 'Ségou', 'Gao'],
    'Guinea': ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé'],
    'Burkina Faso': ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora'],
    'Togo': ['Lomé', 'Sokodé', 'Kara', 'Kpalimé'],
    'Benín': ['Cotonú', 'Porto-Novo', 'Parakou', 'Abomey-Calavi'],
    'RDC': ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Goma', 'Bukavu'],
    'Canadá': ['Montreal', 'Quebec', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'],
    'España': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'],
    'Otros': ['Otro'],
  };

  const paysList = Object.keys(paysVilles);
  const villesDuPays = personalInfo.lieuNaissancePays && personalInfo.lieuNaissancePays in paysVilles
    ? paysVilles[personalInfo.lieuNaissancePays as keyof typeof paysVilles]
    : [];

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/es/compte/connexion');
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

  const handleSave = async () => {
    setIsSaving(true);
    alert('Funcionalidad de guardado - implementar según API');
    setIsSaving(false);
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

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950/30 via-background to-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/es/compte/dashboard/candidat" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Volver al tablero
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              <Save className="h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar'}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-emerald-400">Mi Perfil Candidato</h1>
          <p className="text-muted-foreground">Informaciones sobre el trabajador o la trabajadora extranjera</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <span className="font-semibold">*</span>
            <span>Todos los campos son obligatorios. Complete cada sección completamente antes de continuar.</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progreso del perfil</span>
            <span className="text-sm text-muted-foreground">Sección {activeSection} de 5</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300" style={{ width: `${(activeSection / 5) * 100}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { num: 1, label: 'Informaciones personales' },
            { num: 2, label: 'Estudios' },
            { num: 3, label: 'Experiencias' },
            { num: 4, label: 'Declaración' },
            { num: 5, label: 'Documentos' },
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

        <div className="max-w-4xl">
          {activeSection === 1 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6 border border-violet-500/20">
                <h3 className="text-lg font-semibold text-violet-400 mb-4">1.1 Informaciones de pasaporte <span className="text-xs text-red-400">*</span></h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Apellido <span className="text-red-400">*</span></label>
                    <input type="text" value={personalInfo.nomFamille} onChange={(e) => setPersonalInfo({ ...personalInfo, nomFamille: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Tal como en el pasaporte" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre(s) <span className="text-red-400">*</span></label>
                    <input type="text" value={personalInfo.prenom} onChange={(e) => setPersonalInfo({ ...personalInfo, prenom: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Tal como en el pasaporte" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha de nacimiento <span className="text-red-400">*</span></label>
                    <input type="date" value={personalInfo.dateNaissance} onChange={(e) => setPersonalInfo({ ...personalInfo, dateNaissance: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Número de pasaporte <span className="text-red-400">*</span></label>
                    <input type="text" value={personalInfo.numeroPasseport} onChange={(e) => setPersonalInfo({ ...personalInfo, numeroPasseport: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">1.2 Lugar de nacimiento <span className="text-xs text-red-400">*</span></h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">País <span className="text-red-400">*</span></label>
                    <select value={personalInfo.lieuNaissancePays} onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissancePays: e.target.value, lieuNaissanceVille: '' })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Seleccionar un país</option>
                      {paysList.map((pays) => (<option key={pays} value={pays}>{pays}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ciudad <span className="text-red-400">*</span></label>
                    <select value={personalInfo.lieuNaissanceVille} onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissanceVille: e.target.value })} disabled={!personalInfo.lieuNaissancePays} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">Seleccionar una ciudad</option>
                      {villesDuPays.map((ville) => (<option key={ville} value={ville}>{ville}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Provincia/Estado <span className="text-red-400">*</span></label>
                    <input type="text" value={personalInfo.lieuNaissanceProvince} onChange={(e) => setPersonalInfo({ ...personalInfo, lieuNaissanceProvince: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Ej: Île-de-France, Casablanca-Settat..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">Agregue sus estudios secundarios y postsecundarios. Máximo 5 entradas.</p>
              {studies.map((study, index) => (
                <div key={index} className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6 border border-violet-500/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-violet-400">2.{index + 1} Establecimiento {index + 1}</h3>
                    {index === studies.length - 1 && studies.length < 5 && (
                      <button onClick={addStudy} className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">+ Agregar otro</button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Nombre del establecimiento</label>
                      <input type="text" value={study.etablissement} onChange={(e) => updateStudy(index, 'etablissement', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">País</label>
                      <input type="text" value={study.pays} onChange={(e) => updateStudy(index, 'pays', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Título del diploma obtenido</label>
                      <input type="text" value={study.diplome} onChange={(e) => updateStudy(index, 'diplome', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Dominio de formación</label>
                      <input type="text" value={study.domaine} onChange={(e) => updateStudy(index, 'domaine', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha de inicio</label>
                      <input type="month" value={study.dateDebut} onChange={(e) => updateStudy(index, 'dateDebut', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha de fin</label>
                      <input type="month" value={study.dateFin} onChange={(e) => updateStudy(index, 'dateFin', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 3 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">Agregue sus experiencias profesionales relacionadas con la oferta de empleo y todas sus experiencias de los últimos 5 años. Máximo 5 entradas.</p>
              {experiences.map((exp, index) => (
                <div key={index} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-400">3.{index + 1} Experiencia {index + 1}</h3>
                    {index === experiences.length - 1 && experiences.length < 5 && (
                      <button onClick={addExperience} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">+ Agregar otra</button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Nombre completo de la empresa</label>
                      <input type="text" value={exp.entreprise} onChange={(e) => updateExperience(index, 'entreprise', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ciudad</label>
                      <input type="text" value={exp.ville} onChange={(e) => updateExperience(index, 'ville', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">País</label>
                      <input type="text" value={exp.pays} onChange={(e) => updateExperience(index, 'pays', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Título del puesto ocupado</label>
                      <input type="text" value={exp.poste} onChange={(e) => updateExperience(index, 'poste', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de horas/semana</label>
                      <input type="number" value={exp.heuresSemaine} onChange={(e) => updateExperience(index, 'heuresSemaine', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha de inicio</label>
                      <input type="month" value={exp.dateDebut} onChange={(e) => updateExperience(index, 'dateDebut', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha de fin</label>
                      <input type="month" value={exp.dateFin} onChange={(e) => updateExperience(index, 'dateFin', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Principales tareas realizadas</label>
                      <textarea value={exp.taches} onChange={(e) => updateExperience(index, 'taches', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" rows={4} placeholder="Describa sus principales responsabilidades..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 4 && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
              <h3 className="text-lg font-semibold text-amber-400 mb-4">4. Declaración del candidato</h3>
              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 text-sm">
                  <p className="mb-4">He tomado conocimiento del contenido de este formulario, incluidas sus condiciones, tal como se detalla en la página del gabinete DETIE, y tengo la intención de ocupar un empleo en el marco de mi proyecto de inmigración a Quebec.</p>
                  <p className="text-xs text-muted-foreground italic">NB: Al completar este formulario, acepta el acompañamiento del Gabinete DETIE para la evaluación de competencias, experiencias profesionales así como el coaching de sus expertos a través del mundo si corresponde.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ciudad</label>
                    <input type="text" value={declaration.ville} onChange={(e) => setDeclaration({ ...declaration, ville: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">País</label>
                    <input type="text" value={declaration.pays} onChange={(e) => setDeclaration({ ...declaration, pays: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre completo (para la firma)</label>
                  <input type="text" value={declaration.nomComplet} onChange={(e) => setDeclaration({ ...declaration, nomComplet: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Su nombre completo tal como aparecerá en la firma" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Firma electrónica</label>
                  <div className="rounded-lg border border-border bg-background p-2">
                    <div className="relative w-full h-32 md:h-48">
                      <canvas ref={canvasRef} width={600} height={200} className="w-full h-full cursor-crosshair touch-none rounded border border-border" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={clearSignature} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm">
                      <X className="h-4 w-4" />
                      Borrar
                    </button>
                    {hasSignature && (
                      <span className="flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Firma registrada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <PenTool className="h-3 w-3 inline mr-1" />
                    Dibuje su firma en el cuadro de arriba
                  </p>
                </div>
                <div className="flex items-start gap-3 pt-4">
                  <input type="checkbox" id="accepteConditions" checked={declaration.accepteConditions} onChange={(e) => setDeclaration({ ...declaration, accepteConditions: e.target.checked })} className="h-4 w-4 mt-1 text-amber-500 rounded" />
                  <label htmlFor="accepteConditions" className="text-sm">Declaro que las informaciones proporcionadas son exactas y completas. Comprendo que toda declaración falsa puede llevar al rechazo de mi candidatura.</label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 5 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Subir mi CV
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Agregue su currículum vitae en francés a su perfil</p>
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="doc-cvFrancais" checked={documents.cvFrancais} onChange={(e) => setDocuments({ ...documents, cvFrancais: e.target.checked })} className="h-5 w-5 text-emerald-500 rounded" />
                    <label htmlFor="doc-cvFrancais" className="text-sm font-medium cursor-pointer">Currículum vitae en francés</label>
                  </div>
                  {documents.cvFrancais && (
                    <div className="flex items-center gap-2">
                      <input type="file" id="file-cvFrancais" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload('cvFrancais', file); }} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                      {uploadedFiles.cvFrancais ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="max-w-[150px] truncate">{uploadedFiles.cvFrancais.name}</span>
                        </div>
                      ) : (
                        <label htmlFor="file-cvFrancais" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer transition-colors text-xs font-medium">
                          <Upload className="h-3 w-3" />
                          Elegir archivo
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Otros documentos para enviar</h3>
                <p className="text-sm text-muted-foreground mb-6">Marque todos los documentos que proporciona. Si no proporciona un documento que aplica a su solicitud, adjunte una carta de explicación.</p>
                <div className="space-y-3">
                  {[
                    { key: 'passeport', label: 'Pasaporte válido' },
                    { key: 'domicilePreuve1', label: 'Prueba de domicilio en Quebec (1/2)' },
                    { key: 'domicilePreuve2', label: 'Prueba de domicilio en Quebec (2/2)' },
                    { key: 'diplomesLegalises', label: 'Diplomas legalizados' },
                    { key: 'relevesNotes', label: 'Certificados de notas legalizados' },
                    { key: 'attestationsEmploi', label: 'Certificados de empleo' },
                    { key: 'lettrePresentation', label: 'Carta de presentación' },
                    { key: 'preuveLegaliteExperience', label: 'Prueba de legalidad (extranjero)' },
                    { key: 'releves1Quebec', label: 'Certificados 1 (Quebec)' },
                    { key: 'permisConduire', label: 'Permiso de conducir' },
                  ].map((doc) => (
                    <div key={doc.key} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id={`doc-${doc.key}`} checked={documents[doc.key as keyof typeof documents]} onChange={(e) => setDocuments({ ...documents, [doc.key]: e.target.checked })} className="h-5 w-5 text-blue-500 rounded" />
                        <label htmlFor={`doc-${doc.key}`} className="text-sm font-medium cursor-pointer">{doc.label}</label>
                      </div>
                      {documents[doc.key as keyof typeof documents] && (
                        <div className="flex items-center gap-2">
                          <input type="file" id={`file-${doc.key}`} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(doc.key, file); }} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                          {uploadedFiles[doc.key] ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="max-w-[150px] truncate">{uploadedFiles[doc.key].name}</span>
                            </div>
                          ) : (
                            <label htmlFor={`file-${doc.key}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer transition-colors text-xs font-medium">
                              <Upload className="h-3 w-3" />
                              Elegir archivo
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
                    <p className="text-sm text-amber-200">Si no proporciona un documento que aplica a su solicitud, debe adjuntar una carta de explicación.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={() => setActiveSection(Math.max(1, activeSection - 1))} disabled={activeSection === 1} className="px-6 py-3 rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            ← Sección anterior
          </button>
          {activeSection < 5 ? (
            <button onClick={() => setActiveSection(Math.min(5, activeSection + 1))} className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity">
              Sección siguiente →
            </button>
          ) : (
            <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Enviar el perfil'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
