import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedAdmin, createAuditLog, getClientIp } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des produits', details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { name, scientificName, category, icon, description, specs, isoNorms, exportDetails, islands, imageUrl, isPublished } = body;

    if (!name || !scientificName || !category) {
      return NextResponse.json({ error: 'Champs obligatoires manquants (Nom, Nom scientifique, Catégorie).' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        scientificName,
        category: category || 'Pilier Majeur',
        icon: icon || 'Sparkles',
        description: description || '',
        specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
        isoNorms: isoNorms || 'Non spécifié',
        exportDetails: exportDetails || '',
        islands: islands || 'Grande Comore, Anjouan, Mohéli',
        imageUrl: imageUrl || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'CREATE_PRODUCT',
      details: `Création du produit/filière: ${newProduct.name} (${newProduct.id})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur lors de la création du produit', details: error.message }, { status: 500 });
  }
}
