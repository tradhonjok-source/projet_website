# 🚀 Guide de Déploiement en Production

## ⚠️ SÉCURITÉ - À LIRE AVANT LE DÉPLOIEMENT

### 1. Variables d'Environnement Sensibles

**NE JAMAIS versionner** `.env.local` dans Git. Ce projet utilise `.env.example` comme template.

#### Variables requises pour la production :

```bash
# Clerk Authentication (à récupérer sur https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# PayPal (Production)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_API_URL=https://api-m.paypal.com  # Sandbox: https://api-m.sandbox.paypal.com

# Stripe (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Base de données (Prisma Postgres ou autre)
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# Email (pour le formulaire de contact)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre_email@gmail.com
EMAIL_SERVER_PASSWORD=votre_mot_de_passe_application
CONTACT_EMAIL=contact@cabinetdetie.com
```

### 2. Configuration Vercel

1. **Importer le projet** sur Vercel
2. **Ajouter les variables d'environnement** dans Settings → Environment Variables
3. **Sélectionner l'environnement** (Production, Preview, Development)
4. **Déployer**

### 3. Configuration Prisma Postgres

Si vous utilisez Prisma Postgres :

```bash
# 1. Se connecter à Prisma
npx prisma auth login

# 2. Pull le schéma
npx prisma db pull

# 3. Générer le client
npx prisma generate

# 4. Déployer les migrations
npx prisma migrate deploy
```

### 4. Webhooks à configurer

#### Stripe Webhook
- **URL** : `https://votre-domaine.com/api/webhooks/stripe`
- **Événements à écouter** :
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `customer.subscription.deleted`

#### Clerk Webhooks
- **URL** : `/api/webhooks/clerk`
- Déjà configuré dans le middleware

#### PayPal Webhooks
- **URL** : `https://votre-domaine.com/api/recruteur/paypal/webhook`
- À configurer dans le dashboard PayPal Developer

### 5. Checklist Pré-Déploiement

- [ ] Révoquer l'ancienne `DATABASE_URL` exposée
- [ ] Générer de nouvelles clés API (Clerk, Stripe, PayPal)
- [ ] Configurer les variables d'environnement Vercel
- [ ] Tester le flux de paiement Stripe (mode test puis production)
- [ ] Tester le flux de paiement PayPal
- [ ] Configurer les webhooks Stripe
- [ ] Vérifier que `.env.local` est dans `.gitignore`
- [ ] Tester le formulaire de contact
- [ ] Vérifier les routes admin (doivent être protégées)

### 6. URLs à vérifier après déploiement

| Route | Statut | Notes |
|-------|--------|-------|
| `/fr` | ✅ Publique | Page d'accueil |
| `/fr/compte/connexion` | ✅ Publique | Login Clerk |
| `/fr/compte/dashboard` | 🔒 Protégée | Dashboard utilisateur |
| `/fr/compte/dashboard/recruteur` | 🔒 Protégée | Dashboard recruteur |
| `/fr/admin` | 🔒 Protégée | Admin (nécessite auth) |
| `/api/candidats` | 🔒 Protégée | Nécessite abonnement actif |
| `/api/webhooks/stripe` | 🔐 Webhook | Vérifie la signature Stripe |

### 7. Commandes de Build

```bash
# Installation
npm install

# Build de production
npm run build

# Lancer en production
npm start

# Vérifier le type
npm run type-check

# Linter
npm run lint
```

### 8. Monitoring Post-Déploiement

Après le déploiement, vérifier :

1. **Logs Vercel** : Functions → Logs
2. **Erreur Clerk** : Dashboard Clerk → Activity
3. **Paiements** : Dashboard Stripe/PayPal → Transactions
4. **Emails** : Vérifier la boîte de réception `contact@cabinetdetie.com`

---

**Contact support** : contact@cabinetdetie.com

**Dernière mise à jour** : 2026-08-30
