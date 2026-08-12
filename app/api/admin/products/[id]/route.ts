import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        scientificName: body.scientificName ?? existing.scientificName,
        category: body.category ?? existing.category,
        icon: body.icon ?? existing.icon,
        description: body.description ?? existing.description,
        specs: typeof body.specs === 'string' ? body.specs : JSON.stringify(body.specs ?? existing.specs),
        isoNorms: body.isoNorms ?? existing.isoNorms,
        exportDetails: body.exportDetails ?? existing.exportDetails,
        islands: body.islands ?? existing.islands,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'UPDATE_PRODUCT',
      details: `Mise à jour du produit: ${updated.name} (${updated.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'DELETE_PRODUCT',
      details: `Suppression du produit: ${existing.name} (${existing.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
