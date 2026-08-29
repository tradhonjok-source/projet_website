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
      router.push('/es/compte/connexion');
    }
  }, [isLoaded, isSignedIn, router]);

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
    setSignatureData('');
    setFormData(prev => ({ ...prev, declarationSignature: '' }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    if (formData.declarationAcceptee && !signatureData) {
      setSubmitError('Por favor firme el formulario antes de enviar');
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
        setTimeout(() => {
          router.push('/es/compte/dashboard/recruteur');
        }, 2000);
      } else {
        setSubmitError(result.error || 'Error al enviar');
      }
    } catch (error) {
      setSubmitError('Error de conexión al servidor');
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/es" className="text-xl font-bold gradient-text">Gabinete DETIE</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.firstName || 'Reclutador'}</span>
            <SignOutButton>
              <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-violet-400">Cuestionario Reclutador</h1>
          <p className="text-muted-foreground">Complete todas las secciones para completar su perfil</p>
        </div>

        {submitSuccess && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">¡Cuestionario enviado con éxito! Redireccionando...</span>
          </div>
        )}

        {submitError && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">{submitError}</span>
          </div>
        )}

        <div className="space-y-6 max-w-4xl mx-auto">
          <SectionCard number={1} title="Informaciones sobre la empresa" icon={Building2} isExpanded={expandedSections[1]} onToggle={() => toggleSection(1)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nombre de la empresa" value={formData.entrepriseNom} onChange={(v) => handleInputChange('entrepriseNom', v)} placeholder="Ej: Tecnologías Avanzadas Inc." required />
              <Input label="Número de empresa (NE)" value={formData.entrepriseNE} onChange={(v) => handleInputChange('entrepriseNE', v)} placeholder="Ej: 123456789" />
              <Input label="Dirección" value={formData.entrepriseAdresse} onChange={(v) => handleInputChange('entrepriseAdresse', v)} placeholder="Ej: 123 Calle Principal" className="md:col-span-2" />
              <Input label="Ciudad" value={formData.entrepriseVille} onChange={(v) => handleInputChange('entrepriseVille', v)} placeholder="Ej: Montreal" />
              <Input label="Provincia" value={formData.entrepriseProvince} onChange={(v) => handleInputChange('entrepriseProvince', v)} placeholder="Ej: Quebec" />
              <Input label="Código postal" value={formData.entrepriseCodePostal} onChange={(v) => handleInputChange('entrepriseCodePostal', v)} placeholder="Ej: H1A 1A1" />
              <Input label="Teléfono" value={formData.entrepriseTelephone} onChange={(v) => handleInputChange('entrepriseTelephone', v)} placeholder="Ej: +1 (514) 123-4567" />
              <Input label="Email" type="email" value={formData.entrepriseEmail} onChange={(v) => handleInputChange('entrepriseEmail', v)} placeholder="Ej: contacto@empresa.com" />
              <Input label="Sitio web" type="url" value={formData.entrepriseSiteWeb} onChange={(v) => handleInputChange('entrepriseSiteWeb', v)} placeholder="Ej: https://www.empresa.com" className="md:col-span-2" />
            </div>
          </SectionCard>

          <SectionCard number={2} title="Lobbying" icon={Users} isExpanded={expandedSections[2]} onToggle={() => toggleSection(2)}>
            <div className="space-y-4">
              <Checkbox label="¿Está inscrito en el registro de lobbyistas?" checked={formData.lobbyingInscrit} onChange={(v) => handleInputChange('lobbyingInscrit', v)} />
              {formData.lobbyingInscrit && (
                <>
                  <Input label="Número de inscripción" value={formData.lobbyingNumero} onChange={(v) => handleInputChange('lobbyingNumero', v)} placeholder="Ej: L123456" />
                  <Textarea label="Detalles del lobbying" value={formData.lobbyingDetails} onChange={(v) => handleInputChange('lobbyingDetails', v)} placeholder="Describa sus actividades de lobbying..." rows={3} />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard number={3} title="Reclutamiento" icon={BriefcaseIcon} isExpanded={expandedSections[3]} onToggle={() => toggleSection(3)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Sector de actividad" value={formData.recrutementSecteur} onChange={(v) => handleInputChange('recrutementSecteur', v)} options={[{ value: '', label: 'Seleccionar...' }, { value: 'technologie', label: 'Tecnología' }, { value: 'sante', label: 'Salud' }, { value: 'education', label: 'Educación' }, { value: 'construction', label: 'Construcción' }, { value: 'services', label: 'Servicios' }, { value: 'manufacturier', label: 'Manufacturero' }, { value: 'autre', label: 'Otro' }]} required />
              <Input label="Número de puestos abiertos" type="number" value={formData.recrutementPostesOuverts} onChange={(v) => handleInputChange('recrutementPostesOuverts', parseInt(v) || 0)} placeholder="Ej: 5" />
              <Input label="Escala salarial" value={formData.recrutementSalaires} onChange={(v) => handleInputChange('recrutementSalaires', v)} placeholder="Ej: 50 000$ - 70 000$ CAD" className="md:col-span-2" />
              <Textarea label="Ventajas sociales" value={formData.recrutementAvantages} onChange={(v) => handleInputChange('recrutementAvantages', v)} placeholder="Seguro, RRSP, vacaciones, etc." rows={3} className="md:col-span-2" />
              <Textarea label="Proceso de reclutamiento" value={formData.recrutementProcessus} onChange={(v) => handleInputChange('recrutementProcessus', v)} placeholder="Describa su proceso de selección..." rows={4} className="md:col-span-2" />
            </div>
          </SectionCard>

          <SectionCard number={4} title="Presencia Internacional" icon={Globe} isExpanded={expandedSections[4]} onToggle={() => toggleSection(4)}>
            <div className="space-y-4">
              <Input label="Países de implantación" value={formData.internationalPays} onChange={(v) => handleInputChange('internationalPays', v)} placeholder="Ej: Francia, Bélgica, Senegal..." />
              <Textarea label="Socios internacionales" value={formData.internationalPartenaires} onChange={(v) => handleInputChange('internationalPartenaires', v)} placeholder="Liste sus socios en el extranjero..." rows={3} />
              <Textarea label="Experiencia internacional" value={formData.internationalExperience} onChange={(v) => handleInputChange('internationalExperience', v)} placeholder="Describa su experiencia en reclutamiento internacional..." rows={4} />
            </div>
          </SectionCard>

          <SectionCard number={5} title="Permisos y Orden Profesional" icon={Award} isExpanded={expandedSections[5]} onToggle={() => toggleSection(5)}>
            <div className="space-y-4">
              <Checkbox label="¿El puesto requiere un permiso especial?" checked={formData.permisRequis} onChange={(v) => handleInputChange('permisRequis', v)} />
              {formData.permisRequis && <Input label="Tipos de permisos requeridos" value={formData.permisTypes} onChange={(v) => handleInputChange('permisTypes', v)} placeholder="Ej: Permiso de conducir, permiso de trabajo..." />}
              <Input label="Orden profesional" value={formData.ordreProfessionnel} onChange={(v) => handleInputChange('ordreProfessionnel', v)} placeholder="Ej: OIQ, OCPQ, etc." />
              <Input label="Número de orden" value={formData.ordreNumero} onChange={(v) => handleInputChange('ordreNumero', v)} placeholder="Ej: 12345" />
            </div>
          </SectionCard>

          <SectionCard number={6} title="Implantación en Quebec" icon={MapPin} isExpanded={expandedSections[6]} onToggle={() => toggleSection(6)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Región de Quebec" value={formData.qcRegion} onChange={(v) => handleInputChange('qcRegion', v)} options={[{ value: '', label: 'Seleccionar...' }, { value: 'montreal', label: 'Montreal' }, { value: 'quebec', label: 'Quebec' }, { value: 'estrie', label: 'Estrie' }, { value: 'outaouais', label: 'Outaouais' }, { value: 'saguenay', label: 'Saguenay–Lac-Saint-Jean' }, { value: 'autre', label: 'Otro' }]} />
              <Input label="Ciudad principal" value={formData.qcVillePrimaire} onChange={(v) => handleInputChange('qcVillePrimaire', v)} placeholder="Ej: Montreal" />
              <Textarea label="Establecimientos en Quebec" value={formData.qcEtablissements} onChange={(v) => handleInputChange('qcEtablissements', v)} placeholder="Dirección(es) de sus establecimientos..." rows={3} className="md:col-span-2" />
            </div>
          </SectionCard>

          <SectionCard number={7} title="Informaciones sobre el trabajador extranjero" icon={User} isExpanded={expandedSections[7]} onToggle={() => toggleSection(7)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Apellido" value={formData.travailleurNom} onChange={(v) => handleInputChange('travailleurNom', v)} placeholder="Ej: Dupont" required />
              <Input label="Nombre" value={formData.travailleurPrenom} onChange={(v) => handleInputChange('travailleurPrenom', v)} placeholder="Ej: Jean" required />
              <Input label="Email" type="email" value={formData.travailleurEmail} onChange={(v) => handleInputChange('travailleurEmail', v)} placeholder="Ej: jean.dupont@email.com" />
              <Input label="Teléfono" value={formData.travailleurTelephone} onChange={(v) => handleInputChange('travailleurTelephone', v)} placeholder="Ej: +33 1 23 45 67 89" />
              <Input label="Nacionalidad" value={formData.travailleurNationalite} onChange={(v) => handleInputChange('travailleurNationalite', v)} placeholder="Ej: Francesa" />
              <Input label="Número de pasaporte" value={formData.travailleurPasseport} onChange={(v) => handleInputChange('travailleurPasseport', v)} placeholder="Ej: AB1234567" />
              <Textarea label="Formación" value={formData.travailleurFormation} onChange={(v) => handleInputChange('travailleurFormation', v)} placeholder="Diplomas, certificaciones..." rows={3} className="md:col-span-2" />
              <Textarea label="Experiencia profesional" value={formData.travailleurExperience} onChange={(v) => handleInputChange('travailleurExperience', v)} placeholder="Describa la experiencia pertinente..." rows={4} className="md:col-span-2" />
              <Textarea label="Competencias clave" value={formData.travailleurCompetences} onChange={(v) => handleInputChange('travailleurCompetences', v)} placeholder="Liste las competencias principales..." rows={3} className="md:col-span-2" />
              <Textarea label="Idiomas hablados" value={formData.travailleurLangues} onChange={(v) => handleInputChange('travailleurLangues', v)} placeholder="Ej: Francés (nativo), Inglés (intermedio)..." rows={2} className="md:col-span-2" />
            </div>
          </SectionCard>

          <SectionCard number={8} title="Declaración y firma electrónica" icon={Signature} isExpanded={expandedSections[8]} onToggle={() => toggleSection(8)}>
            <div className="space-y-4">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <p className="text-sm text-amber-200 mb-2">Declaro que toda la información proporcionada en este formulario es exacta y completa. Comprendo que toda declaración falsa puede llevar al rechazo de mi solicitud.</p>
              </div>
              <Checkbox label="Acepto y me comprometo" checked={formData.declarationAcceptee} onChange={(v) => handleInputChange('declarationAcceptee', v)} required />
              {formData.declarationAcceptee && (
                <>
                  <Input label="Nombre completo para firma" value={formData.declarationNom} onChange={(v) => handleInputChange('declarationNom', v)} placeholder="Su nombre completo" />
                  <Input label="Fecha" type="date" value={formData.declarationDate} onChange={(v) => handleInputChange('declarationDate', v)} />
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Firma electrónica <span className="text-red-400">*</span></label>
                    <div className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-2"><PenTool className="h-4 w-4" />Dibuje su firma abajo</span>
                        <button type="button" onClick={clearSignature} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"><Eraser className="h-4 w-4" />Borrar</button>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden bg-white">
                        <canvas ref={canvasRef} width={600} height={200} className="w-full cursor-crosshair touch-none" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
                      </div>
                      {signatureData && (<div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm"><Check className="h-4 w-4" />Firma registrada</div>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          <div className="flex justify-end gap-4 pt-6">
            <Link href="/es/compte/dashboard/recruteur" className="px-6 py-3 rounded-xl border border-border hover:bg-border/10 transition-colors">Cancelar</Link>
            <button onClick={handleSubmit} disabled={isSubmitting || !formData.declarationAcceptee} className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isSubmitting ? (<><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Enviando...</>) : (<><Save className="h-4 w-4" />Enviar el cuestionario</>)}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionCard({ number, title, icon: Icon, isExpanded, onToggle, children }: any) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between hover:bg-border/10 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600"><Icon className="h-5 w-5 text-white" /></div>
          <div className="text-left"><h3 className="text-lg font-semibold">Sección {number}: {title}</h3></div>
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
