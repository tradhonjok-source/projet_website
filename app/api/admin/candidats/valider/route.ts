import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// POST - Valider un candidat
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
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const body = await request.json();
    const { candidateId, action, reason } = body;

    if (!candidateId || !action || !['validate', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
    }

    prisma = createPrismaClient();

    if (action === 'validate') {
      // Valider le candidat
      const updated = await prisma.candidateProfile.update({
        where: { id: candidateId },
        data: {
          isValidated: true,
          validatedAt: new Date(),
          validatedBy: userId,
          rejectedAt: null,
          rejectedBy: null,
          rejectionReason: null,
        },
      });

      await prisma.$disconnect();

      return NextResponse.json({
        success: true,
        message: 'Candidat validé avec succès',
        candidate: updated
      });
    } else if (action === 'reject') {
      // Rejeter le candidat
      const updated = await prisma.candidateProfile.update({
        where: { id: candidateId },
        data: {
          isValidated: false,
          rejectedAt: new Date(),
          rejectedBy: userId,
          rejectionReason: reason || 'Aucun motif fourni',
        },
      });

      await prisma.$disconnect();

      return NextResponse.json({
        success: true,
        message: 'Candidat rejeté',
        candidate: updated
      });
    }

    await prisma.$disconnect();
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  } catch (error) {
    console.error('Erreur validation candidat:', error);
    if (prisma) {
      await prisma?.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la validation du candidat' },
      { status: 500 }
    );
  }
}
