# 🚀 Guide de Déploiement - VPS Hostinger KVM 1

## 📋 Prérequis

- VPS KVM 1 activé (Ubuntu 22.04 ou 24.04)
- Accès SSH : `ssh root@<IP-du-VPS>`
- Nom de domaine (optionnel, pour plus tard)

---

## 🔧 Étape 1 : Connexion SSH

```bash
ssh root@<IP-du-VPS>
# Entrez le mot de passe reçu par email
```

---

## 📦 Étape 2 : Installation des dépendances

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Vérifier l'installation
node -v  # Doit afficher v20.x.x
npm -v   # Doit afficher 10.x.x

# Installer PM2 (gestion de processus)
npm install -g pm2

# Installer Nginx (reverse proxy)
apt install -y nginx

# Installer Git
apt install -y git

# Installer le firewall
apt install -y ufw

# Installer Certbot pour SSL
apt install -y certbot python3-certbot-nginx
```

---

## 🔐 Étape 3 : Configuration du firewall

```bash
# Autoriser SSH
ufw allow OpenSSH

# Autoriser HTTP et HTTPS
ufw allow 'Nginx Full'

# Activer le firewall
ufw enable

# Vérifier le statut
ufw status
```

---

## 🌐 Étape 4 : Déploiement du code

### Option A : Via Git (Recommandé)

```bash
# Créer le dossier d'application
mkdir -p /var/www/cabinetdetie
cd /var/www/cabinetdetie

# Cloner le repository (à créer sur GitHub/GitLab)
git clone <VOTRE_REPO_GIT> .

# Ou copier les fichiers via SCP depuis votre PC
# exit  # quitter SSH
# scp -r C:\projet_website root@<IP>:/var/www/cabinetdetie
# ssh root@<IP>  # revenir

# Installer les dépendances
npm install --production

# Générer Prisma Client
npx prisma generate

# Builder le site
npm run build
```

### Option B : Via SCP (Sans Git)

```bash
# Sur votre PC Windows (PowerShell)
cd C:\projet_website

# Copier les fichiers (exclure node_modules et .next)
scp -r app components lib public package.json package-lock.json \
     prisma next.config.ts middleware.ts tsconfig.json \
     root@<IP>:/var/www/cabinetdetie

# Puis sur le VPS en SSH :
cd /var/www/cabinetdetie
npm install --production
npx prisma generate
npm run build
```

---

## ▶️ Étape 5 : Lancer l'application avec PM2

```bash
cd /var/www/cabinetdetie

# Démarrer l'application
pm2 start npm --name "cabinetdetie" -- start

# Sauvegarder la liste des processus (redémarrage auto)
pm2 save

# Configurer le démarrage automatique au boot
pm2 startup

# La commande précédente affiche une ligne à copier-coller, exemple :
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
# → Exécutez cette ligne !

# Vérifier que tout fonctionne
pm2 status
pm2 logs cabinetdetie
```

---

## 🌍 Étape 6 : Configurer Nginx (Reverse Proxy)

```bash
# Créer le fichier de configuration Nginx
nano /etc/nginx/sites-available/cabinetdetie
```

**Collez cette configuration :**

```nginx
server {
    listen 80;
    server_name _;  # Ou votre domaine : cabinetdetie.com www.cabinetdetie.com

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout pour les API longues
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Compression Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
```

**Enregistrer et quitter** : `Ctrl+X` → `Y` → `Entrée`

```bash
# Activer le site
ln -s /etc/nginx/sites-available/cabinetdetie /etc/nginx/sites-enabled/

# Supprimer le site par défaut
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
nginx -t

# Redémarrer Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## 🔒 Étape 7 : Activer SSL (HTTPS)

### Avec un domaine :

```bash
# Obtenir le certificat SSL gratuit
certbot --nginx -d cabinetdetie.com -d www.cabinetdetie.com

# Renouvellement automatique (déjà configuré par certbot)
# Vérifier : systemctl list-timers | grep certbot
```

### Sans domaine (IP uniquement) :

SSL ne fonctionne pas sans domaine. Utilisez un domaine ou configurez un certificat auto-signé (non recommandé pour la production).

---

## 🗄️ Étape 8 : Configuration de la base de données

### Option A : SQLite (Actuelle - Simple)

```bash
# La DB SQLite est déjà configurée dans prisma/schema.prisma
# Elle sera créée automatiquement au premier lancement

# Vérifier que le fichier existe
ls -la /var/www/cabinetdetie/prisma/dev.db

# Pour sauvegarder la DB
cp /var/www/cabinetdetie/prisma/dev.db /var/www/cabinetdetie/prisma/dev.db.backup.$(date +%Y%m%d)
```

### Option B : MySQL (Recommandé pour production)

```bash
# Installer MySQL
apt install -y mysql-server

# Sécuriser l'installation
mysql_secure_installation

# Créer la base et l'utilisateur
mysql -u root -p

# Dans MySQL :
CREATE DATABASE cabinetdetie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cabinet'@'localhost' IDENTIFIED BY 'MotDePasseFort123!';
GRANT ALL PRIVILEGES ON cabinetdetie.* TO 'cabinet'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Modifier `prisma/schema.prisma` :**

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**Créer `.env` :**

```bash
nano /var/www/cabinetdetie/.env
```

```env
DATABASE_URL="mysql://cabinet:MotDePasseFort123!@localhost:3306/cabinetdetie"
```

```bash
# Appliquer le schema
npx prisma migrate dev
npx prisma generate
```

---

## 📊 Étape 9 : Commandes PM2 utiles

```bash
# Voir tous les processus
pm2 status

# Voir les logs
pm2 logs cabinetdetie

# Redémarrer
pm2 restart cabinetdetie

# Arrêter
pm2 stop cabinetdetie

# Voir l'utilisation CPU/RAM
pm2 monit

# Sauvegarder l'état actuel
pm2 save
```

---

## 🔄 Étape 10 : Mettre à jour le site

```bash
cd /var/www/cabinetdetie

# Récupérer les nouvelles modifications
git pull  # ou scp pour copier les nouveaux fichiers

# Installer les nouvelles dépendances si besoin
npm install --production

# Rebuilder
npm run build

# Redémarrer l'application
pm2 restart cabinetdetie
```

---

## 🛡️ Étape 11 : Backup automatique (Recommandé)

```bash
# Créer un script de backup
nano /var/www/backup-cabinetdetie.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/cabinetdetie"

mkdir -p $BACKUP_DIR

# Backup de la base SQLite
cp /var/www/cabinetdetie/prisma/dev.db $BACKUP_DIR/db_$DATE.sqlite

# Backup du code (optionnel, si pas de Git)
# tar -czf $BACKUP_DIR/code_$DATE.tar.gz /var/www/cabinetdetie

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -name "db_*.sqlite" -mtime +7 -delete

echo "Backup terminé : $DATE"
```

```bash
# Rendre exécutable
chmod +x /var/www/backup-cabinetdetie.sh

# Ajouter au crontab (backup quotidien à 3h du matin)
crontab -e
```

```bash
# Ajouter cette ligne :
0 3 * * * /var/www/backup-cabinetdetie.sh >> /var/log/backup-cabinetdetie.log 2>&1
```

---

## 🔍 Étape 12 : Monitoring (Optionnel)

```bash
# Installer htop pour surveiller les ressources
apt install -y htop

# Voir l'utilisation en temps réel
htop

# Surveiller les logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 📞 En cas de problème

### Le site ne répond pas :

```bash
# Vérifier si PM2 tourne
pm2 status

# Vérifier les logs
pm2 logs cabinetdetie

# Vérifier si Nginx tourne
systemctl status nginx

# Vérifier les ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :80
```

### Erreur 502 Bad Gateway :

```bash
# L'application n'est pas lancée
pm2 restart cabinetdetie
pm2 logs cabinetdetie
```

### Erreur 504 Gateway Timeout :

```bash
# L'API prend trop de temps
# Augmenter le timeout dans Nginx
nano /etc/nginx/sites-available/cabinetdetie
# proxy_read_timeout 120s;
```

---

## ✅ Checklist finale

- [ ] VPS activé et accessible en SSH
- [ ] Node.js 20 installé
- [ ] PM2 installé et configuré
- [ ] Nginx configuré et actif
- [ ] SSL activé (si domaine)
- [ ] Application lancée et accessible
- [ ] Backup automatique configuré
- [ ] Firewall activé (ports 22, 80, 443)

---

## 🎯 Prochaines étapes après déploiement

1. **Tester le site** : `http://<IP-du-VPS>` ou `https://votredomaine.com`
2. **Configurer le domaine** chez votre registrar (pointer vers l'IP du VPS)
3. **Activer SSL** avec Certbot
4. **Configurer les emails** d'erreur (optionnel)
5. **Mettre en place Cloudflare** (gratuit, pour CDN + protection DDoS)

---

**Besoin d'aide ?** Copiez-collez les erreurs dans votre terminal !
