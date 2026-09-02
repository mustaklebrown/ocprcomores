import nodemailer from 'nodemailer';

/**
 * Service d'envoi d'emails professionnels pour OCPR Comores
 * Compatible avec Hostinger Webmail, Titan Mail, cPanel SMTP, Gmail ou tout serveur SMTP standard.
 */

interface ContactEmailParams {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  ipAddress?: string | null;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

/**
 * Envoie une notification par email à l'organisation (OCPR Comores)
 */
export async function sendContactNotificationEmail(params: ContactEmailParams): Promise<{ sent: boolean; reason?: string }> {
  const transporter = getTransporter();
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER || 'info@ocprcomores.com';
  const fromEmail = process.env.SMTP_FROM || `"Portail OCPR Comores" <${process.env.SMTP_USER || 'contact@ocprcomores.com'}>`;

  if (!transporter) {
    console.info('ℹ️ [Email Service] SMTP non configuré dans .env. Message sauvegardé en base de données.');
    return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  const currentDate = new Date().toLocaleString('fr-FR', {
    timeZone: 'Indian/Comoro',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #1E293B; }
    .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #E2E8F0; }
    .header { background: linear-gradient(135deg, #0B2313 0%, #184E2A 100%); padding: 30px 25px; text-align: center; color: #FFFFFF; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; font-size: 12px; color: #DAA520; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
    .content { padding: 30px 25px; }
    .badge { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    .field-group { margin-bottom: 18px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 4px; }
    .field-value { font-size: 14px; color: #0F172A; font-weight: 500; }
    .message-box { background: #F8FAFC; border-left: 4px solid #184E2A; padding: 16px; border-radius: 0 12px 12px 0; margin-top: 15px; }
    .message-content { font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    .footer { background: #F1F5F9; padding: 18px 25px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; }
    .button { display: inline-block; background: #184E2A; color: #FFFFFF !important; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Office Comorien des Produits de Rente</h1>
      <p>Nouveau Message Reçu depuis le Portail Web</p>
    </div>
    <div class="content">
      <div class="badge">Nouveau Message de Contact</div>
      
      <div class="field-group">
        <div class="field-label">Expéditeur</div>
        <div class="field-value">${params.name} &lt;<a href="mailto:${params.email}" style="color: #184E2A;">${params.email}</a>&gt;</div>
      </div>

      ${params.phone ? `
      <div class="field-group">
        <div class="field-label">Téléphone</div>
        <div class="field-value">${params.phone}</div>
      </div>
      ` : ''}

      <div class="field-group">
        <div class="field-label">Objet de la demande</div>
        <div class="field-value">${params.subject}</div>
      </div>

      <div class="field-group" style="border-bottom: none;">
        <div class="field-label">Message de l'usager</div>
        <div class="message-box">
          <div class="message-content">${params.message}</div>
        </div>
      </div>

      <center>
        <a href="mailto:${params.email}?subject=RE: ${encodeURIComponent(params.subject)}" class="button">
          ✉️ Répondre directement à ${params.name}
        </a>
      </center>
    </div>
    <div class="footer">
      Date de réception : ${currentDate}<br>
      Adresse IP : ${params.ipAddress || 'Non enregistrée'}<br>
      © 2026 Office Comorien des Produits de Rente (OCPR) — Union des Comores
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: receiverEmail,
      replyTo: `"${params.name}" <${params.email}>`,
      subject: `[Portail OCPR] ${params.subject} — de ${params.name}`,
      text: `Nouveau message de contact OCPR Comores:\n\nNom: ${params.name}\nEmail: ${params.email}\nTéléphone: ${params.phone || 'Non renseigné'}\nObjet: ${params.subject}\nDate: ${currentDate}\n\nMessage:\n${params.message}`,
      html: htmlContent,
    });

    console.log(`✅ [Email Service] Notification envoyée avec succès à ${receiverEmail}`);
    return { sent: true };
  } catch (error: any) {
    console.error('❌ [Email Service] Erreur lors de l’envoi de l’email:', error);
    return { sent: false, reason: error.message };
  }
}
