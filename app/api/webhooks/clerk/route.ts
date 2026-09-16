import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { escape } from 'html-escaper';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  const body = await req.text();

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Gérer l'événement user.created
  if (eventType === 'user.created') {
    const { id, email_addresses, public_metadata, first_name, last_name } = evt.data;

    // Déterminer le rôle par défaut selon l'email
    // Les utilisateurs avec email @cabinetdetie.com sont admins
    const email = email_addresses[0]?.email_address || '';
    let defaultRole = 'candidat';
    let isValidated = false;

    if (email.includes('@cabinetdetie.com')) {
      defaultRole = 'admin';
      isValidated = true; // Admins sont auto-validés
    }

    // Les recruteurs doivent être validés par un admin
    if (public_metadata?.role === 'recruteur') {
      defaultRole = 'recruteur';
      isValidated = false; // En attente de validation
    }

    try {
      const prisma = createPrismaClient();

      // Créer l'utilisateur dans la base de données
      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: email,
          role: defaultRole,
          isValidated,
        },
        update: {
          email: email,
        },
      });

      await prisma.$disconnect();

      // Envoyer une notification email si c'est un candidat
      if (defaultRole === 'candidat') {
        try {
          const isProd = process.env.NODE_ENV === 'production';
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST || 'smtp.hostinger.com',
            port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
            secure: process.env.EMAIL_SERVER_PORT === '465', // true pour port 465
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          });

          const dashboardUrl = isProd
            ? 'https://www.cabinetdetie.com/fr/compte/dashboard/admin/candidats'
            : 'http://localhost:3000/fr/compte/dashboard/admin/candidats';

          // Sanitization des données
          const safeFirstName = escape(first_name || '');
          const safeLastName = escape(last_name || '');
          const safeEmail = escape(email);

          await transporter.sendMail({
            from: `"Cabinet DETIE" <${process.env.EMAIL_SERVER_USER}>`,
            to: 'contact@cabinetdetie.com',
            subject: `Nouveau candidat inscrit - ${safeFirstName} ${safeLastName}`,
            html: `
              <h2>Nouveau candidat inscrit</h2>
              <p>Un nouveau candidat vient de s'inscrire sur la plateforme.</p>
              <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nom complet</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${safeFirstName} ${safeLastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date d'inscription</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString('fr-FR')}</td>
                </tr>
              </table>
              <p style="margin-top: 20px;">
                <a href="${dashboardUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px;">
                  Voir les candidats inscrits
                </a>
              </p>
            `,
            text: `
Nouveau candidat inscrit

Nom complet: ${first_name || ''} ${last_name || ''}
Email: ${email}
Date d'inscription: ${new Date().toLocaleDateString('fr-FR')}

Lien vers le dashboard: ${dashboardUrl}
            `,
          });
        } catch (emailError) {
          console.error('Erreur envoi email notification candidat:', emailError);
          // Ne pas bloquer le webhook si l'email échoue
        }
      }
    } catch (error) {
      console.error('Erreur création utilisateur dans DB:', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
