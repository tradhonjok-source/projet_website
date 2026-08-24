#!/bin/bash
# Script de déploiement automatique - Cabinet DETIE
# À exécuter sur le VPS Hostinger (Ubuntu)

echo "🚀 Démarrage du déploiement..."

# 1. Mettre à jour le système
echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

# 2. Installer Node.js 20
echo "🟢 Installation de Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Installer PM2
echo "📊 Installation de PM2..."
npm install -g pm2

# 4. Installer Nginx
echo "🌐 Installation de Nginx..."
apt install -y nginx

# 5. Installer Git
echo "📂 Installation de Git..."
apt install -y git

# 6. Configurer le firewall
echo "🔐 Configuration du firewall..."
apt install -y ufw
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 7. Créer le dossier d'application
echo "📁 Création du dossier d'application..."
mkdir -p /var/www/cabinetdetie
cd /var/www/cabinetdetie

# 8. Installer les dépendances (à adapter selon votre méthode de déploiement)
echo "📦 Installation des dépendances..."
# npm install --production

# 9. Générer Prisma Client
echo "🗄️ Génération de Prisma Client..."
# npx prisma generate

# 10. Builder le site
echo "🔨 Build du site..."
# npm run build

# 11. Configurer Nginx
echo "⚙️ Configuration de Nginx..."
cat > /etc/nginx/sites-available/cabinetdetie << 'EOF'
server {
    listen 80;
    server_name _;

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
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;
}
EOF

# Activer le site
ln -s /etc/nginx/sites-available/cabinetdetie /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et redémarrer Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "✅ Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Copiez vos fichiers dans /var/www/cabinetdetie"
echo "2. Exécutez: npm install --production"
echo "3. Exécutez: npx prisma generate"
echo "4. Exécutez: npm run build"
echo "5. Démarrez avec PM2: pm2 start npm --name 'cabinetdetie' -- start"
echo "6. Sauvegardez PM2: pm2 save"
echo "7. Configurez PM2 startup: pm2 startup"
