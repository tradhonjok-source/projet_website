import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// POST - Sauvegarder le questionnaire recruteur
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
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
          email: body.entrepriseEmail || '',
          role: 'recruteur',
        },
      });
    }

    // Sauvegarder ou mettre à jour le questionnaire
    const questionnaire = await prisma.recruiterQuestionnaire.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        entrepriseNom: body.entrepriseNom,
        entrepriseAdresse: body.entrepriseAdresse,
        entrepriseVille: body.entrepriseVille,
        entrepriseProvince: body.entrepriseProvince,
        entrepriseCodePostal: body.entrepriseCodePostal,
        entrepriseTelephone: body.entrepriseTelephone,
        entrepriseEmail: body.entrepriseEmail,
        entrepriseSiteWeb: body.entrepriseSiteWeb,
        entrepriseNE: body.entrepriseNE,
        lobbyingInscrit: body.lobbyingInscrit ?? false,
        lobbyingNumero: body.lobbyingNumero,
        lobbyingDetails: body.lobbyingDetails,
        recrutementSecteur: body.recrutementSecteur,
        recrutementPostesOuverts: body.recrutementPostesOuverts ?? 0,
        recrutementSalaires: body.recrutementSalaires,
        recrutementAvantages: body.recrutementAvantages,
        recrutementProcessus: body.recrutementProcessus,
        internationalPays: body.internationalPays,
        internationalPartenaires: body.internationalPartenaires,
        internationalExperience: body.internationalExperience,
        permisRequis: body.permisRequis ?? false,
        permisTypes: body.permisTypes,
        ordreProfessionnel: body.ordreProfessionnel,
        ordreNumero: body.ordreNumero,
        qcRegion: body.qcRegion,
        qcVillePrimaire: body.qcVillePrimaire,
        qcEtablissements: body.qcEtablissements,
        travailleurNom: body.travailleurNom,
        travailleurPrenom: body.travailleurPrenom,
        travailleurEmail: body.travailleurEmail,
        travailleurTelephone: body.travailleurTelephone,
        travailleurNationalite: body.travailleurNationalite,
        travailleurPasseport: body.travailleurPasseport,
        travailleurFormation: body.travailleurFormation,
        travailleurExperience: body.travailleurExperience,
        travailleurCompetences: body.travailleurCompetences,
        travailleurLangues: body.travailleurLangues,
        declarationAcceptee: body.declarationAcceptee ?? false,
        declarationNom: body.declarationNom,
        declarationDate: body.declarationDate,
        declarationSignature: body.declarationSignature,
      },
      update: {
        entrepriseNom: body.entrepriseNom,
        entrepriseAdresse: body.entrepriseAdresse,
        entrepriseVille: body.entrepriseVille,
        entrepriseProvince: body.entrepriseProvince,
        entrepriseCodePostal: body.entrepriseCodePostal,
        entrepriseTelephone: body.entrepriseTelephone,
        entrepriseEmail: body.entrepriseEmail,
        entrepriseSiteWeb: body.entrepriseSiteWeb,
        entrepriseNE: body.entrepriseNE,
        lobbyingInscrit: body.lobbyingInscrit ?? false,
        lobbyingNumero: body.lobbyingNumero,
        lobbyingDetails: body.lobbyingDetails,
        recrutementSecteur: body.recrutementSecteur,
        recrutementPostesOuverts: body.recrutementPostesOuverts ?? 0,
        recrutementSalaires: body.recrutementSalaires,
        recrutementAvantages: body.recrutementAvantages,
        recrutementProcessus: body.recrutementProcessus,
        internationalPays: body.internationalPays,
        internationalPartenaires: body.internationalPartenaires,
        internationalExperience: body.internationalExperience,
        permisRequis: body.permisRequis ?? false,
        permisTypes: body.permisTypes,
        ordreProfessionnel: body.ordreProfessionnel,
        ordreNumero: body.ordreNumero,
        qcRegion: body.qcRegion,
        qcVillePrimaire: body.qcVillePrimaire,
        qcEtablissements: body.qcEtablissements,
        travailleurNom: body.travailleurNom,
        travailleurPrenom: body.travailleurPrenom,
        travailleurEmail: body.travailleurEmail,
        travailleurTelephone: body.travailleurTelephone,
        travailleurNationalite: body.travailleurNationalite,
        travailleurPasseport: body.travailleurPasseport,
        travailleurFormation: body.travailleurFormation,
        travailleurExperience: body.travailleurExperience,
        travailleurCompetences: body.travailleurCompetences,
        travailleurLangues: body.travailleurLangues,
        declarationAcceptee: body.declarationAcceptee ?? false,
        declarationNom: body.declarationNom,
        declarationDate: body.declarationDate,
        declarationSignature: body.declarationSignature,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Questionnaire soumis avec succès',
      questionnaire,
    });
  } catch (error) {
    console.error('Erreur POST questionnaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la soumission du questionnaire' },
      { status: 500 }
    );
  }
}
