import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import { sendMail, adminInbox, esc } from '@/lib/mailer';

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

    // E-mails de confirmation aux deux parties (un échec ne bloque pas la soumission).
    const isProd = process.env.NODE_ENV === 'production';
    const adminUrl = isProd
      ? 'https://www.cabinetdetie.com/fr/compte/dashboard/admin/recruteurs'
      : 'http://localhost:3000/fr/compte/dashboard/admin/recruteurs';
    const safeEntreprise = esc(questionnaire.entrepriseNom);
    const safeSecteur = esc(questionnaire.recrutementSecteur);
    const safeEmail = esc(questionnaire.entrepriseEmail);
    const recruteurEmail = user.email || questionnaire.entrepriseEmail || '';

    try {
      await sendMail({
        to: adminInbox(),
        subject: `Nouveau questionnaire recruteur soumis - ${safeEntreprise}`,
        html: `
          <h2 style="color: #7c3aed;">Nouveau questionnaire recruteur soumis</h2>
          <p>Un recruteur vient de soumettre son questionnaire et attend validation.</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px; font-family: sans-serif;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Entreprise</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeEntreprise}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Secteur</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeSecteur}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email entreprise</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Postes ouverts</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${questionnaire.recrutementPostesOuverts}</td>
            </tr>
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${adminUrl}" style="display: inline-block; padding: 14px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: sans-serif;">
              Valider le recruteur
            </a>
          </div>
        `,
        text: `
Nouveau questionnaire recruteur soumis

Entreprise: ${questionnaire.entrepriseNom || ''}
Secteur: ${questionnaire.recrutementSecteur || ''}
Email: ${questionnaire.entrepriseEmail || ''}
Postes ouverts: ${questionnaire.recrutementPostesOuverts}

Valider: ${adminUrl}
        `,
      });
    } catch (e) {
      console.error('❌ ERREUR ENVOI EMAIL ADMIN (questionnaire recruteur):', e);
    }

    if (recruteurEmail) {
      try {
        await sendMail({
          to: recruteurEmail,
          subject: 'Confirmation — votre questionnaire a bien été reçu (Cabinet DETIE)',
          html: `
            <h2 style="color: #7c3aed;">Questionnaire bien reçu ✅</h2>
            <p>Bonjour,</p>
            <p>Nous confirmons la réception de votre questionnaire pour <strong>${safeEntreprise}</strong>.</p>
            <p>Notre équipe validera votre compte recruteur dans les plus brefs délais ; vous recevrez un courriel dès la validation.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Ceci est un message automatique — merci de ne pas y répondre directement.
            </p>
          `,
          text: `Bonjour,

Nous confirmons la réception de votre questionnaire (${questionnaire.entrepriseNom || 'votre entreprise'}).
Votre compte recruteur sera validé sous peu.

Message automatique — Cabinet DETIE.`,
        });
      } catch (e) {
        console.error('❌ ERREUR ENVOI CONFIRMATION RECRUTEUR:', e);
      }
    }

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
