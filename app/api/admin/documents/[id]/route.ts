import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.document.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.fileUrl !== undefined && { fileUrl: body.fileUrl }),
        ...(body.fileName !== undefined && { fileName: body.fileName }),
        ...(body.fileSize !== undefined && { fileSize: body.fileSize }),
        ...(body.fileFormat !== undefined && { fileFormat: body.fileFormat }),
        ...(body.date !== undefined && { date: body.date }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.downloads !== undefined && { downloads: body.downloads }),
      },
    });

    return NextResponse.json({ success: true, document: updated });
  } catch (error: any) {
    console.error('Admin Document PUT Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du document' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Document supprimé avec succès' });
  } catch (error: any) {
    console.error('Admin Document DELETE Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du document' },
      { status: 500 }
    );
  }
}
