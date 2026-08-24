-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nomFamille" TEXT,
    "prenom" TEXT,
    "dateNaissance" DATETIME,
    "numeroPasseport" TEXT,
    "passeportDateDebut" DATETIME,
    "passeportDateFin" DATETIME,
    "lieuNaissanceVille" TEXT,
    "lieuNaissanceProvince" TEXT,
    "lieuNaissancePays" TEXT,
    "adresseNumero" TEXT,
    "adresseRue" TEXT,
    "adresseAppartement" TEXT,
    "adresseVille" TEXT,
    "adresseProvince" TEXT,
    "adresseCodePostal" TEXT,
    "adressePays" TEXT,
    "telephone" TEXT,
    "statutImmigration" TEXT,
    "controleEntreprise" BOOLEAN NOT NULL DEFAULT false,
    "controleEntrepriseDetails" TEXT,
    "etudes" JSONB,
    "experiences" JSONB,
    "declarationVille" TEXT,
    "declarationPays" TEXT,
    "declarationNomComplet" TEXT,
    "declarationSignature" TEXT,
    "declarationAcceptee" BOOLEAN NOT NULL DEFAULT false,
    "documents" JSONB,
    "fichiersUploades" JSONB,
    CONSTRAINT "CandidateProfile_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User" ("clerkId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'candidat',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_clerkUserId_key" ON "CandidateProfile"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
