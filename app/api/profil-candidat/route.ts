import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import { sendMail, adminInbox, esc } from '@/lib/mailer';

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

    // Envoyer la notification à l'admin (boîte du cabinet) + confirmation au candidat.
    // Un échec d'e-mail ne doit JAMAIS bloquer la sauvegarde du profil.
    const isProd = process.env.NODE_ENV === 'production';
    const profileUrl = isProd
      ? 'https://www.cabinetdetie.com/fr/compte/dashboard/admin/candidats'
      : 'http://localhost:3000/fr/compte/dashboard/admin/candidats';

    // Sanitization des données pour prévenir les attaques XSS
    const safePrenom = esc(body.prenom);
    const safeNom = esc(body.nomFamille);
    const safeEmail = esc(email || body.email);
    const safeTelephone = esc(body.telephone);
    const safeVille = esc(body.adresseVille);
    const safePays = esc(body.adressePays);

    try {
      await sendMail({
        to: adminInbox(),
        subject: `Nouveau candidat à valider - ${safePrenom} ${safeNom}`,
        html: `
          <h2 style="color: #059669;">Nouveau profil candidat soumis</h2>
          <p>Un nouveau profil candidat a été soumis et nécessite une validation.</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px; font-family: sans-serif;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nom complet</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safePrenom} ${safeNom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Téléphone</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeTelephone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ville</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeVille}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Pays</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safePays}</td>
            </tr>
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${profileUrl}" style="display: inline-block; padding: 14px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              Voir les documents du candidat
            </a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666; font-family: sans-serif;">
            Ceci est une notification automatique envoyée depuis le portail candidat du Cabinet DETIE.
          </p>
        `,
        text: `
Nouveau profil candidat soumis

Nom complet: ${body.prenom || ''} ${body.nomFamille || ''}
Email: ${email || body.email || ''}
Téléphone: ${body.telephone || ''}
Ville: ${body.adresseVille || ''}
Pays: ${body.adressePays || ''}

Lien pour voir les documents et valider: ${profileUrl}
        `,
      });
    } catch (emailError) {
      console.error('❌ ERREUR ENVOI EMAIL ADMIN (profil candidat) :', {
        message: emailError instanceof Error ? emailError.message : String(emailError),
        timestamp: new Date().toISOString(),
        userEmail: email || body.email,
      });
    }

    // Confirmation au candidat lui-même
    const candidateEmail = email || body.email;
    if (candidateEmail) {
      try {
        await sendMail({
          to: candidateEmail,
          subject: 'Confirmation — votre profil candidat a bien été reçu (Cabinet DETIE)',
          html: `
            <h2 style="color: #059669;">Profil bien reçu ✅</h2>
            <p>Bonjour ${safePrenom} ${safeNom},</p>
            <p>Nous confirmons la réception de votre profil candidat sur le portail du <strong>Cabinet DETIE</strong>.</p>
            <p>Notre équipe procédera à la <strong>validation de votre dossier</strong> et vous contactera si des documents complémentaires sont nécessaires.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Ceci est un message automatique — merci de ne pas y répondre directement.
            </p>
          `,
          text: `Bonjour ${body.prenom || ''} ${body.nomFamille || ''},

Nous confirmons la réception de votre profil candidat (Cabinet DETIE).
Notre équipe procédera à la validation de votre dossier et vous contactera si besoin.

Message automatique — merci de ne pas y répondre.`,
        });
      } catch (emailError) {
        console.error('❌ ERREUR ENVOI CONFIRMATION CANDIDAT :', {
          message: emailError instanceof Error ? emailError.message : String(emailError),
          timestamp: new Date().toISOString(),
          candidateEmail,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profil sauvegardé avec succès',
      profile
    });
  } catch (error) {
    // Logger côté serveur uniquement
    console.error('Erreur POST profil:', error);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    // En production, ne pas exposer les détails de l'erreur
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
