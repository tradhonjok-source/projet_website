import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';
import { sendMail, adminInbox, esc } from '@/lib/mailer';

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

      // Envoyer les notifications email (candidat ET recruteur) : au cabinet + bienvenue à l'inscrit
      if (defaultRole === 'candidat' || defaultRole === 'recruteur') {
        const isProd = process.env.NODE_ENV === 'production';
        const origin = isProd ? 'https://www.cabinetdetie.com' : 'http://localhost:3000';
        const adminCandidatsUrl = `${origin}/fr/compte/dashboard/admin/candidats`;
        const adminRecruteursUrl = `${origin}/fr/compte/dashboard/admin/recruteurs`;

        const safeFirstName = esc(first_name);
        const safeLastName = esc(last_name);
        const safeEmail = esc(email);
        const fullName = `${first_name || ''} ${last_name || ''}`.trim() || email;
        const roleLabel = defaultRole === 'recruteur' ? 'recruteur' : 'candidat';

        // 1) Notification au cabinet (boîte admin)
        try {
          await sendMail({
            to: adminInbox(),
            subject: `Nouvelle inscription ${roleLabel} - ${safeFirstName} ${safeLastName}`,
            html: `
              <h2>Nouvelle inscription ${roleLabel}</h2>
              <p>Un nouveau ${roleLabel} vient de s'inscrire sur la plateforme.</p>
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
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Rôle</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${roleLabel}${defaultRole === 'recruteur' ? ' (en attente de validation)' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date d'inscription</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString('fr-FR')}</td>
                </tr>
              </table>
              <p style="margin-top: 20px;">
                <a href="${defaultRole === 'recruteur' ? adminRecruteursUrl : adminCandidatsUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px;">
                  Voir dans l'admin
                </a>
              </p>
            `,
            text: `
Nouvelle inscription ${roleLabel}

Nom complet: ${first_name || ''} ${last_name || ''}
Email: ${email}
Rôle: ${roleLabel}
Date d'inscription: ${new Date().toLocaleDateString('fr-FR')}

Admin: ${defaultRole === 'recruteur' ? adminRecruteursUrl : adminCandidatsUrl}
            `,
          });
        } catch (emailError) {
          console.error('Erreur envoi email notification admin:', emailError);
          // Ne pas bloquer le webhook si l'email échoue
        }

        // 2) E-mail de bienvenue à l'inscrit lui-même
        if (email) {
          try {
            const dashboardUrl = `${origin}/fr/compte/dashboard`;
            const welcomeSubject =
              defaultRole === 'recruteur'
                ? 'Bienvenue au Cabinet DETIE — votre compte recruteur est en attente de validation'
                : 'Bienvenue au Cabinet DETIE — votre espace candidat est prêt';
            const welcomeBody =
              defaultRole === 'recruteur'
                ? `<p>Bonjour ${safeFirstName || 'cher partenaire'},</p>
                   <p>Merci de votre inscription en tant que <strong>recruteur</strong> sur la plateforme du Cabinet DETIE.</p>
                   <p>Notre équipe va <strong>valider votre compte</strong> sous peu. Dès la validation, vous pourrez publier des offres et consulter les candidats.</p>`
                : `<p>Bonjour ${safeFirstName || 'cher candidat'},</p>
                   <p>Bienvenue sur la plateforme du <strong>Cabinet DETIE</strong> ! Votre espace candidat est prêt.</p>
                   <p>Vous pouvez dès maintenant compléter votre profil, déposer votre CV et postuler aux offres.</p>`;

            await sendMail({
              to: email,
              subject: welcomeSubject,
              html: `
                <h2 style="color: #7c3aed;">Bienvenue au Cabinet DETIE 👋</h2>
                ${welcomeBody}
                <p style="margin-top: 20px;">
                  <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Ouvrir mon espace
                  </a>
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">
                  Message automatique du Cabinet DETIE — merci de ne pas y répondre directement.
                </p>
              `,
              text: `Bonjour ${first_name || ''},

${defaultRole === 'recruteur'
  ? 'Merci de votre inscription recruteur. Notre équipe validera votre compte sous peu ; vous pourrez alors publier des offres.'
  : 'Bienvenue ! Votre espace candidat est prêt : complétez votre profil, déposez votre CV et postulez aux offres.'}

Ouvrir mon espace : ${dashboardUrl}

Message automatique — Cabinet DETIE.`,
            });
          } catch (emailError) {
            console.error('Erreur envoi email bienvenue:', emailError);
          }
        }
      }
    } catch (error) {
      console.error('Erreur création utilisateur dans DB:', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
