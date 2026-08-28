import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// GET - Récupérer le profil du candidat
export async function GET(request: NextRequest) {
  let prisma;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    prisma = createPrismaClient();

    const profile = await prisma.candidateProfile.findUnique({
      where: { clerkUserId: userId },
    });

    await prisma.$disconnect();

    if (!profile) {
      return NextResponse.json({ message: 'Profil non trouvé' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Erreur GET profil:', error);
    if (prisma) {
      await prisma?.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder le profil du candidat
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  let prisma;
  try {
    const body = await request.json();
    console.log('=== POST /api/profil-candidat ===');
    console.log('userId:', userId);

    prisma = createPrismaClient();

    // Vérifier si l'utilisateur existe, sinon le créer
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: body.email || '',
          role: 'candidat',
        },
      });
    }

    // Helper pour convertir les dates vides en null
    const parseDate = (dateValue: any): Date | null => {
      if (!dateValue || dateValue === '') return null;
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    };

    // Récupérer l'email depuis Clerk si pas dans le body
    const email = body.email || body.email || '';

    // Sauvegarder ou mettre à jour le profil
    const profile = await prisma.candidateProfile.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        email: email,
        nomFamille: body.nomFamille ?? '',
        prenom: body.prenom ?? '',
        dateNaissance: parseDate(body.dateNaissance),
        numeroPasseport: body.numeroPasseport ?? '',
        passeportDateDebut: parseDate(body.passeportDateDebut),
        passeportDateFin: parseDate(body.passeportDateFin),
        lieuNaissanceVille: body.lieuNaissanceVille ?? '',
        lieuNaissanceProvince: body.lieuNaissanceProvince ?? '',
        lieuNaissancePays: body.lieuNaissancePays ?? '',
        adresseNumero: body.adresseNumero ?? '',
        adresseRue: body.adresseRue ?? '',
        adresseAppartement: body.adresseAppartement ?? '',
        adresseVille: body.adresseVille ?? '',
        adresseProvince: body.adresseProvince ?? '',
        adresseCodePostal: body.adresseCodePostal ?? '',
        adressePays: body.adressePays ?? '',
        telephone: body.telephone ?? '',
        statutImmigration: body.statutImmigration ?? '',
        controleEntreprise: body.controleEntreprise ?? false,
        controleEntrepriseDetails: body.controleEntrepriseDetails ?? '',
        etudes: body.etudes ?? [],
        experiences: body.experiences ?? [],
        declarationVille: body.declarationVille ?? '',
        declarationPays: body.declarationPays ?? '',
        declarationNomComplet: body.declarationNomComplet ?? '',
        declarationSignature: body.declarationSignature ?? '',
        declarationAcceptee: body.declarationAcceptee ?? false,
        documents: body.documents ?? {},
        fichiersUploades: body.fichiersUploades ?? {},
      },
      update: {
        email: body.email || '',
        nomFamille: body.nomFamille ?? '',
        prenom: body.prenom ?? '',
        dateNaissance: parseDate(body.dateNaissance),
        numeroPasseport: body.numeroPasseport ?? '',
        passeportDateDebut: parseDate(body.passeportDateDebut),
        passeportDateFin: parseDate(body.passeportDateFin),
        lieuNaissanceVille: body.lieuNaissanceVille ?? '',
        lieuNaissanceProvince: body.lieuNaissanceProvince ?? '',
        lieuNaissancePays: body.lieuNaissancePays ?? '',
        adresseNumero: body.adresseNumero ?? '',
        adresseRue: body.adresseRue ?? '',
        adresseAppartement: body.adresseAppartement ?? '',
        adresseVille: body.adresseVille ?? '',
        adresseProvince: body.adresseProvince ?? '',
        adresseCodePostal: body.adresseCodePostal ?? '',
        adressePays: body.adressePays ?? '',
        telephone: body.telephone ?? '',
        statutImmigration: body.statutImmigration ?? '',
        controleEntreprise: body.controleEntreprise ?? false,
        controleEntrepriseDetails: body.controleEntrepriseDetails ?? '',
        etudes: body.etudes ?? [],
        experiences: body.experiences ?? [],
        declarationVille: body.declarationVille ?? '',
        declarationPays: body.declarationPays ?? '',
        declarationNomComplet: body.declarationNomComplet ?? '',
        declarationSignature: body.declarationSignature ?? '',
        declarationAcceptee: body.declarationAcceptee ?? false,
        documents: body.documents ?? {},
        fichiersUploades: body.fichiersUploades ?? {},
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Profil sauvegardé avec succès',
      profile
    });
  } catch (error) {
    console.error('Erreur POST profil:', error);
    console.error('Détails erreur:', error instanceof Error ? error.message : error);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      {
        error: 'Erreur serveur lors de la sauvegarde du profil',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
