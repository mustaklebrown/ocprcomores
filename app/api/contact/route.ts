import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClientIp } from '@/lib/auth';
import { sendContactNotificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires du formulaire.' },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(req);
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanSubject = String(subject).trim();
    const cleanMessage = String(message).trim();
    const cleanPhone = phone ? String(phone).trim() : null;

    let savedMessage = null;
    try {
      savedMessage = await prisma.contactMessage.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: cleanSubject,
          message: cleanMessage,
          status: 'UNREAD',
          ipAddress,
        },
      });
    } catch (dbErr) {
      console.warn('⚠️ Stockage en base de données non disponible (fallback actif):', dbErr);
    }

    // Envoi de l'email de notification aux adresses de l'organisation OCPR Comores
    const emailResult = await sendContactNotificationEmail({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: 'Votre message a été transmis avec succès à l’Administration OCPR Comores.',
      id: savedMessage?.id || null,
      emailSent: emailResult.sent,
    });
  } catch (error: any) {
    console.error('Contact Form Route Error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l’envoi de votre message.' },
      { status: 500 }
    );
  }
}
