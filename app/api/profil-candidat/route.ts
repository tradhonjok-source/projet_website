import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// GET - Récupérer le profil du candidat
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

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
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder le profil du candidat
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

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

    // Sauvegarder ou mettre à jour le profil
    const profile = await prisma.candidateProfile.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        email: body.email || '',
        nomFamille: body.nomFamille,
        prenom: body.prenom,
        dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
        numeroPasseport: body.numeroPasseport,
        passeportDateDebut: body.passeportDateDebut ? new Date(body.passeportDateDebut) : null,
        passeportDateFin: body.passeportDateFin ? new Date(body.passeportDateFin) : null,
        lieuNaissanceVille: body.lieuNaissanceVille,
        lieuNaissanceProvince: body.lieuNaissanceProvince,
        lieuNaissancePays: body.lieuNaissancePays,
        adresseNumero: body.adresseNumero,
        adresseRue: body.adresseRue,
        adresseAppartement: body.adresseAppartement,
        adresseVille: body.adresseVille,
        adresseProvince: body.adresseProvince,
        adresseCodePostal: body.adresseCodePostal,
        adressePays: body.adressePays,
        telephone: body.telephone,
        statutImmigration: body.statutImmigration,
        controleEntreprise: body.controleEntreprise ?? false,
        controleEntrepriseDetails: body.controleEntrepriseDetails,
        etudes: body.etudes,
        experiences: body.experiences,
        declarationVille: body.declarationVille,
        declarationPays: body.declarationPays,
        declarationNomComplet: body.declarationNomComplet,
        declarationSignature: body.declarationSignature,
        declarationAcceptee: body.declarationAcceptee ?? false,
        documents: body.documents,
        fichiersUploades: body.fichiersUploades,
      },
      update: {
        email: body.email || '',
        nomFamille: body.nomFamille,
        prenom: body.prenom,
        dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
        numeroPasseport: body.numeroPasseport,
        passeportDateDebut: body.passeportDateDebut ? new Date(body.passeportDateDebut) : null,
        passeportDateFin: body.passeportDateFin ? new Date(body.passeportDateFin) : null,
        lieuNaissanceVille: body.lieuNaissanceVille,
        lieuNaissanceProvince: body.lieuNaissanceProvince,
        lieuNaissancePays: body.lieuNaissancePays,
        adresseNumero: body.adresseNumero,
        adresseRue: body.adresseRue,
        adresseAppartement: body.adresseAppartement,
        adresseVille: body.adresseVille,
        adresseProvince: body.adresseProvince,
        adresseCodePostal: body.adresseCodePostal,
        adressePays: body.adressePays,
        telephone: body.telephone,
        statutImmigration: body.statutImmigration,
        controleEntreprise: body.controleEntreprise ?? false,
        controleEntrepriseDetails: body.controleEntrepriseDetails,
        etudes: body.etudes,
        experiences: body.experiences,
        declarationVille: body.declarationVille,
        declarationPays: body.declarationPays,
        declarationNomComplet: body.declarationNomComplet,
        declarationSignature: body.declarationSignature,
        declarationAcceptee: body.declarationAcceptee ?? false,
        documents: body.documents,
        fichiersUploades: body.fichiersUploades,
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
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde du profil' },
      { status: 500 }
    );
  }
}
