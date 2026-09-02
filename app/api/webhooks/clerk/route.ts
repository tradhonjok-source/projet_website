import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

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
    const { id, email_addresses, public_metadata } = evt.data;

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

    // Mettre à jour l'utilisateur avec le rôle par défaut
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
    } catch (error) {
      console.error('Erreur création utilisateur dans DB:', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
