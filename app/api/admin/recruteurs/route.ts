import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createPrismaClient } from '@/lib/prisma';

// GET - Récupérer la liste des recruteurs en attente de validation
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
      return NextResponse.json({ error: 'Accès réservé aux admins' }, { status: 403 });
    }

    prisma = createPrismaClient();

    // Récupérer tous les utilisateurs avec rôle recruteur
    const recruiters = await prisma.user.findMany({
      where: {
        role: 'recruteur',
      },
      include: {
        recruiterSubscription: {
          select: {
            isActive: true,
            plan: true,
            endDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prisma.$disconnect();

    // Formater les données
    const formattedRecruiters = recruiters.map(recruiter => ({
      id: recruiter.id,
      clerkId: recruiter.clerkId,
      email: recruiter.email,
      role: recruiter.role,
      isValidated: recruiter.isValidated,
      validatedAt: recruiter.validatedAt,
      rejectedAt: recruiter.rejectedAt,
      rejectionReason: recruiter.rejectionReason,
      createdAt: recruiter.createdAt,
      hasSubscription: !!recruiter.recruiterSubscription?.isActive,
      subscriptionPlan: recruiter.recruiterSubscription?.plan,
      subscriptionEnd: recruiter.recruiterSubscription?.endDate,
    }));

    return NextResponse.json({ recruiters: formattedRecruiters });
  } catch (error) {
    console.error('Erreur GET recruteurs admin:', error);
    if (prisma) {
      await prisma?.$disconnect().catch(() => {});
    }
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des recruteurs' },
      { status: 500 }
    );
  }
}
