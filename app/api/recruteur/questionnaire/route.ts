import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// POST - Sauvegarder le questionnaire recruteur
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  let prisma;
  try {
    const body = await request.json();
    prisma = createPrismaClient();

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
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }

    // Détails de l'erreur pour le débogage
    const errorDetails = error instanceof Error ? error.message : 'Erreur inconnue';
    const errorStack = error instanceof Error ? error.stack : '';

    // Messages d'erreur plus explicites
    let userMessage = 'Erreur serveur lors de la soumission du questionnaire';

    if (errorDetails.includes('PrismaClientValidationError')) {
      userMessage = 'Données invalides : Vérifiez que tous les champs sont correctement remplis';
    } else if (errorDetails.includes('Foreign key constraint')) {
      userMessage = 'Erreur de base de données : Votre compte utilisateur n\'est pas correctement lié';
    } else if (errorDetails.includes('unique constraint')) {
      userMessage = 'Un questionnaire existe déjà pour votre compte';
    } else if (errorDetails.includes('connection') || errorDetails.includes('connect')) {
      userMessage = 'Erreur de connexion à la base de données';
    } else if (errorDetails.includes('timeout')) {
      userMessage = 'La requête a expiré, veuillez réessayer';
    }

    console.error('Détails:', errorDetails);
    console.error('Stack:', errorStack);

    return NextResponse.json(
      {
        error: userMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
