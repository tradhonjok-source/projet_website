import nodemailer from 'nodemailer';
import { escape } from 'html-escaper';

/**
 * Envoi d'e-mails via SMTP (Gmail ou autre fournisseur) configuré par les
 * variables d'environnement EMAIL_SERVER_*.
 *
 * Destinataires :
 *  - EMAIL_ADMIN_TO (ou CONTACT_EMAIL en repli) : boîte du cabinet (validation).
 *  - L'expéditeur : EMAIL_SERVER_USER.
 *
 * Ne JAMAIS faire échouer l'opération métier à cause d'un e-mail : les appels
 * sont enveloppés en try/catch par les routeurs et journalisés.
 */

export function getTransporter() {
  const isProd = process.env.NODE_ENV === 'production';
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: isProd, // TLS requis en production
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

/** Adresse e-mail de la boîte du cabinet (validation admin). */
export function adminInbox(): string {
  return process.env.EMAIL_ADMIN_TO || process.env.CONTACT_EMAIL || 'contact@cabinetdetie.com';
}

export function fromAddress(): string {
  return `"Cabinet DETIE" <${process.env.EMAIL_SERVER_USER}>`;
}

export interface MailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail(params: MailParams): Promise<void> {
  await getTransporter().sendMail({ from: fromAddress(), ...params });
}

/** Échappe une valeur pour l'insérer sans risque dans du HTML d'e-mail. */
export function esc(value: unknown): string {
  return escape(String(value ?? ''));
}
