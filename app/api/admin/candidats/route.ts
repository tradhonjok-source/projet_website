import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// GET - Récupérer la liste de tous les candidats (admin seulement)
export async function GET(request: NextRequest) {
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

    prisma = createPrismaClient();

    // Récupérer tous les profils candidats avec leurs infos de base
    const candidates = await prisma.candidateProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prisma.$disconnect();

    // Formater les données pour l'affichage
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      clerkUserId: candidate.clerkUserId,
      email: candidate.email,
      nomFamille: candidate.nomFamille,
      prenom: candidate.prenom,
      telephone: candidate.telephone,
      lieuNaissancePays: candidate.lieuNaissancePays,
      adresseVille: candidate.adresseVille,
      adressePays: candidate.adressePays,
      statutImmigration: candidate.statutImmigration,
      createdAt: candidate.createdAt,
      isValidated: candidate.isValidated,
      validatedAt: candidate.validatedAt,
      rejectedAt: candidate.rejectedAt,
      rejectionReason: candidate.rejectionReason,
      userEmail: candidate.user.email,
    }));

    return NextResponse.json({ candidates: formattedCandidates });
  } catch (error) {
    console.error('Erreur GET candidats:', error);
    if (prisma) {
      await prisma?.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des candidats' },
      { status: 500 }
    );
  }
}
