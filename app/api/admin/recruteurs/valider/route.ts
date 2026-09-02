import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { escape } from 'html-escaper';

// POST - Valider ou rejeter un recruteur
export async function POST(request: NextRequest) {
  let prisma;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que l'utilisateur est admin
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role as string;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Accès réservé aux admins' }, { status: 403 });
    }

    const body = await request.json();
    const { recruiterId, action, reason } = body;

    if (!recruiterId || !action || !['validate', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Paramètres invalides' },
        { status: 400 }
      );
    }

    prisma = createPrismaClient();

    if (action === 'validate') {
      // Valider le recruteur
      await prisma.user.update({
        where: { id: recruiterId },
        data: {
          isValidated: true,
          validatedAt: new Date(),
          validatedBy: userId,
          rejectedAt: null,
          rejectedBy: null,
          rejectionReason: null,
        },
      });

      // Envoyer email de confirmation au recruteur
      try {
        const recruiter = await prisma.user.findUnique({
          where: { id: recruiterId },
          include: { recruiterSubscription: true },
        });

        if (recruiter) {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
            secure: process.env.NODE_ENV === 'production',
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          });

          const dashboardUrl = process.env.NODE_ENV === 'production'
            ? 'https://www.cabinetdetie.com/fr/compte/dashboard/recruteur'
            : 'http://localhost:3000/fr/compte/dashboard/recruteur';

          await transporter.sendMail({
            from: `"Cabinet DETIE" <${process.env.EMAIL_SERVER_USER}>`,
            to: recruiter.email,
            subject: 'Votre compte recruteur a été validé',
            html: `
              <h2>Compte validé avec succès</h2>
              <p>Bonjour,</p>
              <p>Votre compte recruteur sur <strong>Cabinet DETIE</strong> a été validé par notre équipe administrative.</p>
              <p>Vous pouvez maintenant :</p>
              <ul>
                <li>Accéder à la base de candidats validés</li>
                <li>Publier des offres d'emploi</li>
                <li>Contacter les candidats</li>
              </ul>
              <p style="margin-top: 20px;">
                <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 5px;">
                  Accéder à votre dashboard
                </a>
              </p>
              <p style="margin-top: 20px; color: #666;">
                Si vous avez des questions, n'hésitez pas à nous contacter à contact@cabinetdetie.com
              </p>
            `,
            text: `
              Compte validé avec succès

              Bonjour,

              Votre compte recruteur sur Cabinet DETIE a été validé par notre équipe administrative.

              Vous pouvez maintenant accéder à la base de candidats validés et publier des offres d'emploi.

              Dashboard: ${dashboardUrl}

              Questions: contact@cabinetdetie.com
            `,
          });
        }
      } catch (emailError) {
        console.error('Erreur envoi email validation recruteur:', emailError);
        // Ne pas bloquer la validation si l'email échoue
      }

      return NextResponse.json({ success: true, message: 'Recruteur validé avec succès' });
    }

    if (action === 'reject') {
      // Rejeter le recruteur
      await prisma.user.update({
        where: { id: recruiterId },
        data: {
          isValidated: false,
          rejectedAt: new Date(),
          rejectedBy: userId,
          rejectionReason: reason || 'Aucun motif fourni',
        },
      });

      // Envoyer email de rejet au recruteur
      try {
        const recruiter = await prisma.user.findUnique({
          where: { id: recruiterId },
        });

        if (recruiter) {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
            secure: process.env.NODE_ENV === 'production',
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: `"Cabinet DETIE" <${process.env.EMAIL_SERVER_USER}>`,
            to: recruiter.email,
            subject: 'Votre compte recruteur - Décision de validation',
            html: `
              <h2>Décision concernant votre compte</h2>
              <p>Bonjour,</p>
              <p>Nous vous informons que votre demande de compte recruteur sur <strong>Cabinet DETIE</strong> n'a pas été validée.</p>
              ${reason ? `<p><strong>Motif :</strong></p><p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${escape(reason)}</p>` : ''}
              <p style="margin-top: 20px; color: #666;">
                Pour toute question, vous pouvez nous contacter à contact@cabinetdetie.com
              </p>
            `,
            text: `
              Décision concernant votre compte

              Bonjour,

              Votre demande de compte recruteur sur Cabinet DETIE n'a pas été validée.

              ${reason ? `Motif : ${reason}` : ''}

              Questions: contact@cabinetdetie.com
            `,
          });
        }
      } catch (emailError) {
        console.error('Erreur envoi email rejet recruteur:', emailError);
      }

      return NextResponse.json({ success: true, message: 'Recruteur rejeté avec succès' });
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  } catch (error) {
    console.error('Erreur validation recruteur:', error);
    if (prisma) {
      await prisma.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la validation du recruteur' },
      { status: 500 }
    );
  }
}
