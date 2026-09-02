import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { escape } from 'html-escaper';

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

    // Envoyer une notification email à l'admin
    try {
      const isProd = process.env.NODE_ENV === 'production';
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: isProd, // TLS requis en production
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      const profileUrl = isProd
        ? 'https://www.cabinetdetie.com/fr/compte/dashboard/admin/candidats'
        : 'http://localhost:3000/fr/compte/dashboard/admin/candidats';

      // Sanitization des données pour prévenir les attaques XSS
      const safePrenom = escape(String(body.prenom || ''));
      const safeNom = escape(String(body.nomFamille || ''));
      const safeEmail = escape(String(body.email || ''));
      const safeTelephone = escape(String(body.telephone || ''));
      const safeVille = escape(String(body.adresseVille || ''));
      const safePays = escape(String(body.adressePays || ''));

      await transporter.sendMail({
        from: `"Cabinet DETIE" <${process.env.EMAIL_SERVER_USER}>`,
        to: 'contact@cabinetdetie.com',
        subject: `Nouveau candidat à valider - ${safePrenom} ${safeNom}`,
        html: `
          <h2>Nouveau profil candidat soumis</h2>
          <p>Un nouveau profil candidat a été soumis et nécessite une validation.</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nom complet</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safePrenom} ${safeNom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Téléphone</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeTelephone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ville</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safeVille}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Pays</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${safePays}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="${profileUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px;">
              Valider ce candidat
            </a>
          </p>
        `,
        text: `
Nouveau profil candidat soumis

Nom complet: ${body.prenom || ''} ${body.nomFamille || ''}
Email: ${body.email || ''}
Téléphone: ${body.telephone || ''}
Ville: ${body.adresseVille || ''}
Pays: ${body.adressePays || ''}

Lien de validation: ${profileUrl}
        `,
      });
    } catch (emailError) {
      console.error('Erreur envoi email notification admin:', emailError);
      // Ne pas bloquer la sauvegarde si l'email échoue
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
