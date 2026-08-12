import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getClientIp } from '@/lib/auth';

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

    let savedMessage = null;
    try {
      savedMessage = await prisma.contactMessage.create({
        data: {
          name: String(name).trim(),
          email: String(email).trim().toLowerCase(),
          phone: phone ? String(phone).trim() : null,
          subject: String(subject).trim(),
          message: String(message).trim(),
          status: 'UNREAD',
          ipAddress,
        },
      });
    } catch (dbErr) {
      console.warn('Prisma store message fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Votre message a été transmis avec succès à l Administration OCPR Comores.',
      id: savedMessage?.id || null,
    });
  } catch (error: any) {
    console.error('Contact Form Route Error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l envoi de votre message.' },
      { status: 500 }
    );
  }
}
