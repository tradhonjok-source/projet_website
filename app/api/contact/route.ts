import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { escape } from 'html-escaper';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting: 5 requêtes par minute par IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit:contact',
});

// POST - Envoyer un email de contact
export async function POST(request: NextRequest) {
  let email: string = '';
  let nom: string = '';
  try {
    // Vérifier le rate limiting
    const ip = request.ip ?? 'unknown';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Trop de requêtes. Veuillez attendre quelques minutes.',
          remaining: remaining,
          reset: new Date(reset).toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    nom = body.nom;
    email = body.email;
    const sujet = body.sujet;
    const message = body.message;

    // Validation des champs obligatoires
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Configuration du transporteur SMTP
    // Pour utiliser ce service, configurez les variables d'environnement suivantes :
    // - EMAIL_SERVER_HOST: smtp.gmail.com (ou autre)
    // - EMAIL_SERVER_PORT: 587
    // - EMAIL_SERVER_USER: votre email
    // - EMAIL_SERVER_PASSWORD: votre mot de passe d'application
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Formatage du sujet selon le type
    const sujetMap: Record<string, string> = {
      'recruteur': 'Recruteur - Nouvelle demande de contact',
      'candidat': 'Candidat - Nouvelle demande de contact',
      'partenariat': 'Partenariat - Nouvelle demande de contact',
      'information': 'Demande d\'information',
      'autre': 'Contact - Message divers',
    };

    // Sanitization des inputs pour prévenir les attaques XSS
    const safeNom = escape(nom);
    const safeEmail = escape(email);
    const safeSujet = escape(sujet);
    const safeMessage = escape(message);

    // Envoi de l'email
    await transporter.sendMail({
      from: `"${safeNom}" <${safeEmail}>`,
      to: process.env.CONTACT_EMAIL || 'contact@cabinetdetie.com',
      replyTo: safeEmail,
      subject: sujetMap[sujet] || `Contact - ${safeSujet}`,
      html: `
        <h2>Nouvelle demande de contact</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nom</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${safeNom}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Sujet</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${sujetMap[sujet] || safeSujet}</td>
          </tr>
        </table>
        <h3>Message</h3>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${safeMessage}</p>
      `,
      text: `
Nouvelle demande de contact

Nom: ${nom}
Email: ${email}
Sujet: ${sujetMap[sujet] || sujet}

Message:
${message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Logger côté serveur uniquement
    console.error('Erreur envoi email contact:', error);

    // En mode développement, accepter l'envoi sans SMTP configuré
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL DE CONTACT (DEV MODE) ===');
      console.log('To: contact@cabinetdetie.com');
      console.log('From:', nom, '<', email, '>');
      return NextResponse.json({ success: true, devMode: true });
    }

    // En production, ne pas exposer les détails de l'erreur
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
